import { NextApiRequest, NextApiResponse } from "next";
import { QueryKind } from "../../lib/query_kinds";
const ENDPOINT =
  "https://ftbk772hkb.execute-api.eu-west-1.amazonaws.com/dev/webhook";
const fetch = require("@zeit/fetch-retry")(require("isomorphic-unfetch"));
export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const queryKind: string = req.query.queryKind as string;
  const queryKindEnum: QueryKind = QueryKind[queryKind];
  if (queryKind === undefined) {
    res.status(500).send("You must provide a query kind");
  } else if (!(queryKind in QueryKind)) {
    res.status(500).send("Invalid query kind");
  } else if (queryKindEnum === QueryKind.meta_for_id) {
    const paperId = req.query.id as string;
    sendWithParam({ id: paperId, queryKind: QueryKind.meta_for_id }, res);
  } else if (queryKind === QueryKind.paper_for_text) {
    const text = req.query.text as string;
    sendWithParam({ text: text, queryKind: QueryKind.paper_for_text }, res);
  } else if (queryKind === QueryKind.paper_for_doi) {
    const doi = req.query.doi as string;
    sendWithParam({ doi: doi, queryKind: QueryKind.paper_for_doi }, res);
  } else if (queryKind === QueryKind.meta_for_id) {
    const doi = req.query.doi as string;
    sendWithParam({ doi: doi, queryKind: QueryKind.meta_for_doi }, res);
  }
}

function sendWithParam(
  inputParams: { [key: string]: string },
  res: NextApiResponse
) {
  var url = new URL(ENDPOINT);

  var params = new URLSearchParams(inputParams);
  url.search = params.toString();
  fetch(url.toString(), {
    headers: { "X-API-KEY": process.env.DB_REST_API_KEY }
  })
    .then(response => response.json())
    // So that we only ever call the same paper once
    .then(jsonified => {
      if (!(jsonified === { message: "Internal server error" })) {
        res.setHeader("Cache-Control", "max-age=0, s-maxage=864000");
      }
      res.json(JSON.stringify(jsonified));
    });
}
