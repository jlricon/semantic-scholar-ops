import { useRouter } from "next/router";
import "../styles/main.css";
import GwernPaperDiv from "../components/GwernPaperDiv";
import { NextPageContext } from "next";
import { QueryKind } from "../lib/query_kinds";
import * as Sentry from '@sentry/node'
const fetch = require("@zeit/fetch-retry")(require("isomorphic-unfetch"));
const Content = ({ papers }) => {
  const router = useRouter();
  const doi = router.query.doi;
  return (
    <div
      className="flex flex-col bg-gray-300 h-full"
      style={{ minHeight: "100vh" }}
    >
      <div className="mx-auto">
        <h1 className="font-bold  text-2xl text-center text-gray-800 ">
          Papers that cite {doi}
        </h1>
      </div>

      <div className="flex flex-col items-stretch py-4 mx-auto">
        <h1 className="font-bold  text-2xl text-center pb-3">
          Systematic reviews and meta-analysis
        </h1>
        {papers
          .filter(paper => paper.is_meta)
          .map((value, index) => {
            return <GwernPaperDiv paper={value} key={index} />;
          })}
        <hr className="border-black my-4 border-t10"></hr>
        <h1 className="font-bold  text-2xl text-center py-3">Other papers</h1>
        {papers
          .filter(paper => !paper.is_meta)
          .map((value, index) => {
            return <GwernPaperDiv paper={value} key={index} />;
          })}
      </div>
    </div>
  );
};

export default Content;
Content.getInitialProps = async function(context: NextPageContext) {
  const ENDPOINT =
    "https://ftbk772hkb.execute-api.eu-west-1.amazonaws.com/dev/webhook";
  var url = new URL(ENDPOINT);

  const { doi } = context.query;
  Sentry.captureMessage(`Citations for doi ${doi}`);
  var params = new URLSearchParams({
    doi: doi as string,
    queryKind: QueryKind.citations_for_doi
  });
  url.search = params.toString();

  return await fetch(url.toString(), {
    headers: { "X-API-KEY": process.env.DB_REST_API_KEY }
  })
    .then(response => response.json())
    // So that we only ever call the same paper once
    .then(jsonified => {
      if (!(jsonified === { message: "Internal server error" })) {
        context.res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
        return { papers: jsonified };
      }
      console.log("Internal server error");
      return { papers: [] };
    })
    .catch([]);
};
