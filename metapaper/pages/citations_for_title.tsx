import { useRouter } from "next/router";
import "../styles/main.css";
import GwernPaperDiv from "../components/GwernPaperDiv";
import { NextPageContext } from "next";
import * as Sentry from '@sentry/node'
const fetch = require("@zeit/fetch-retry")(require("isomorphic-unfetch"));
const matchtext = nmatches =>
  nmatches === 1000 ? "1000 matches or more" : `${nmatches} matches`;
const Content = ({ papers, nmatches }) => {
  const router = useRouter();
  const title = router.query.title;
  return (
    <div
      className="flex flex-col bg-gray-300 h-full"
      style={{ minHeight: "100vh" }}
    >
      <div className="mx-auto">
        <h1 className="font-bold  text-2xl text-center text-gray-800 ">
          Papers that cite {title} ({matchtext(nmatches)} for that title,
          showing only one)
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
  const ENDPOINT = "https://hasura-ss.herokuapp.com/v1/graphql";
  
  const { title } = context.query;

  Sentry.captureMessage(`Citations for title ${title}`);
  const graphqlRequest = {
    query: `query MyQuery($lim: Int, $text: String, $lim2: Int) {
      search_paper_citations(args: {lim: $lim, search: $text}, order_by: {pubyear: desc_nulls_last}) {
        title
        paper_abstract
        pubyear
        venue
        is_meta
        doi
      }
      search_paper_aggregate(args: {lim: $lim2, search: $text}) {
        aggregate {
          count
        }
      }
    }`,
    variables: { lim: 100, text: title, lim2: 1000 }
  };
  return await fetch(ENDPOINT, {
    headers: { "x-hasura-admin-secret": process.env.DB_REST_API_KEY },
    body: JSON.stringify(graphqlRequest),
    method: "POST"
  })
    .then(response => response.json())
    // So that we only ever call the same paper once
    .then(jsonified => {
      context.res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");

      return {
        papers: jsonified.data.search_paper_citations,
        nmatches: jsonified.data.search_paper_aggregate.aggregate.count
      };
    })
    .catch(ex => {
      console.log(`An exception occurred ${ex}`);
      return { papers: [], nmatches: 0 };
    });
};
