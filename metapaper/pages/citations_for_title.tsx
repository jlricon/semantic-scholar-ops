import { useRouter } from "next/router";
import "../styles/main.css";
import GwernPaperDiv from "../components/GwernPaperDiv";
import { NextPageContext } from "next";
import { QueryKind } from "../lib/query_kinds";
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
  const ENDPOINT =
    "https://ftbk772hkb.execute-api.eu-west-1.amazonaws.com/dev/webhook";
  var url = new URL(ENDPOINT);

  const { title } = context.query;
  console.log(`Citations for title ${title}`);
  var params = new URLSearchParams({
    title: title as string,
    queryKind: QueryKind.citations_for_title
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
        return { papers: jsonified.rows, nmatches: jsonified.nmatches };
      }
      console.log("Internal server error");
      return { papers: [], nmatches: [] };
    })
    .catch([]);
};
