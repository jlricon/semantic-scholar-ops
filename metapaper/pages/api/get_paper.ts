import { NextApiRequest, NextApiResponse } from "next";
import { QueryKind } from "../../lib/query_kinds";
import * as Sentry from "@sentry/node";
import { ServerResponse } from "http";
const ENDPOINT = "https://hasura-ss.herokuapp.com/v1/graphql";
const fetch = require("@zeit/fetch-retry")(require("isomorphic-unfetch"));
Sentry.init({
  // Replace with your project's Sentry DSN
  dsn: `https://4a090e4850194046a0c4e7ead31c09a0@sentry.io/1839641`
});
export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const queryKind: string = req.query.queryKind as string;
  const queryKindEnum: QueryKind = QueryKind[queryKind];
  Sentry.captureMessage(
    `Got queryKind ${queryKind} with query ${JSON.stringify(req.query)}`
  );
  if (queryKind === undefined) {
    res.status(500).send("You must provide a query kind");
  } else if (!(queryKind in QueryKind)) {
    res.status(500).send("Invalid query kind");
  } else if (queryKindEnum === QueryKind.meta_for_id) {
    const paperId = req.query.id as string;
    sendMetaQuery(paperId, res);
  } else if (queryKind === QueryKind.paper_for_text) {
    const text = req.query.text as string;
    sendTextQueryAndCache(text, res);
  }
}

function sendMetaQuery(paperId: string, res: NextApiResponse) {
  const graphqlRequest = {
    query: `query MyQuery ($text:String) {
      search_metas_for_id(args: {search: $text}, order_by: {pubyear: desc_nulls_last}) {
        doi
        id
        is_meta
        paper_abstract
        pubyear
        title
        venue
      }
    }`,
    variables: { text: paperId }
  };

  fetch(ENDPOINT, {
    headers: { "x-hasura-admin-secret": process.env.DB_REST_API_KEY },
    body: JSON.stringify(graphqlRequest),
    method: "POST"
  })
    .then(response => response.json())
    // So that we only ever call the same paper once
    .then(jsonified => {
      if (!(jsonified === { message: "Internal server error" })) {
        res.setHeader("Cache-Control", "max-age=0, s-maxage=864000");
      }
      res.json(JSON.stringify(jsonified.data.search_metas_for_id));
    });
}

export async function sendTextQuery(text: string): Promise<any> {
  const graphqlRequest = {
    query: `query MyQuery($lim: Int, $text: String) {
      search_paper(args: {lim: $lim, search: $text}, order_by: {pubyear: desc_nulls_last}) {
        title
        paper_abstract
        pubyear
        venue
        is_meta
        doi
        id
      }
    }`,
    variables: { text: text, lim: 20 }
  };
  return fetch(ENDPOINT, {
    headers: { "x-hasura-admin-secret": process.env.DB_REST_API_KEY },
    body: JSON.stringify(graphqlRequest),
    method: "POST"
  })
    .then(response => {
      const p = response.json();
      return p;
    })
    .catch({ message: "Internal server error" });
}
export async function sendTextQueryAndCache(
  text: string,
  res: NextApiResponse
) {
  const jsonified = await sendTextQuery(text);
  // So that we only ever call the same paper once
  if (!(jsonified === { message: "Internal server error" })) {
    res.setHeader("Cache-Control", "max-age=0, s-maxage=864000");
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.json(JSON.stringify(jsonified.data.search_paper));
}
