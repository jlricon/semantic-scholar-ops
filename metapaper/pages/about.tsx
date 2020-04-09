import "../styles/main.css";

import ReactGA from "react-ga";
import Link from "next/link";
import { withRedux, Actions } from "../lib/redux";
import { isDev, origin } from "../lib/lib";
import { useEffect } from "react";
function initGa() {
  ReactGA.initialize("UA-4255500-3");
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const About = () => {
  useEffect(() => {
    if (!isDev) {
      initGa();
      console.log("GA is on");
    }
  }, []);
  return (
    <div
      className="flex flex-col bg-gray-300 h-full"
      style={{ minHeight: "100vh" }}
    >
      <div className="mx-auto">
        <h1 className="font-bold  text-4xl md:text-6xl text-center text-gray-800">
          <Link href="/">
            <a>Meta-Search</a>
          </Link>
        </h1>
      </div>
      <div className="mx-10">
        <h2 className="text-xl md:text-2xl">About</h2>
        <p>
          Meta-Search is a tool to search papers, like Google Scholar, but built
          with a particular workflow in mind: Focusing on meta-analysis and
          literature reviews rather than individual results. The default search
          works as in other search engines, but clicking the{" "}
          <span>
            {" "}
            <svg
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current w-4 h-4 inline-block"
            >
              <path
                d="M12.906 14.32a8 8 0 111.414-1.414l5.337 5.337-1.414 1.414-5.337-5.337zM8 14A6 6 0 108 2a6 6 0 000 12z"
                fillRule="evenodd"
              />
            </svg>
          </span>{" "}
          icon will then search the relevant meta-analyses.
          <p>
            In addition to search, you can also search directly for all
            citations, sorted by recency with sys/meta separated from the rest
          </p>
        </p>
        <h2 className="text-xl md:text-2xl">Endpoints:</h2>
        <ul className="list-disc ml-5 text-justify">
          <li>
            <span className="font-mono text-s text-teal-500">/?s=...</span> will
            search for papers that match that title
          </li>
          <li>
            <span className="font-mono text-s text-teal-500">
              /?meta_for_id=...
            </span>{" "}
            will return meta-analysis/ systematic reviews that cited the paper
            that matches the provided Semantic Scholar ID{" "}
          </li>

          <li>
            <span className="font-mono text-s text-teal-500">
              /citations_for_doi?doi=...
            </span>{" "}
            will return papers that cite the paper that matches that doi, sorted
            by date and wether or not they are systematic reviews/meta-analysis
          </li>
          <li>
            <span className="font-mono text-s text-teal-500">
              /citations_for_title?title=...
            </span>{" "}
            As above but for paper titles. If the title matches more than one
            paper, the first one will be considered for citations. Using the DOI
            search is preferred.
          </li>
        </ul>
        <h2 className="text-xl md:text-2xl">Tech</h2>
        <h3 className="text-l md:text-xl">Frontend</h3>
        As an overall framework, Meta-Search is built on top of Next.js+Redux
        with some TailwindCSS to make it look nice.
        <h3 className="text-l md:text-xl">Backend</h3>
        <p>
          There is no backend! Well, there are a bunch of serverless functions
          that Next.js generates automatically. On first load, the page makes
          use of server side rendering for speed. The site is hosted on Zeit.co,
          and all calls to my internal API or the website endpoints are cached,
          as the underlying dataset doesn't change.
        </p>
        <p>
          The data is some ~200Gb of tables in a single Postgres instance in
          AWS, with a Hasura GraphQL server sitting in front. Postgres allows me
          to do full-text search and to use composite indices for search, so I
          don't need extra infraestructure to make this work. Eventually this
          will be migrated to AWS Aurora, and the whole thing will be purely
          serverless and able to handle any load.
        </p>
        <h3 className="text-l md:text-xl">Other</h3>
        <p>
          I test with cypress+percy, this takes screenshots of various pre-set
          website interactions and compares them with prior approved ones. It
          runs automatically via Github Actions.
        </p>
        <p>For logging I rely on Sentry and Loggly.</p>
      </div>
    </div>
  );
};

export default withRedux(About);

About.getInitialProps = async ({ reduxStore, req, res }) => {
  if (process.browser !== true) {
    const { dispatch } = reduxStore;
    dispatch({ type: Actions.SET_HOST, host: origin(req) });
    res.setHeader("Cache-Control", "max-age=0, s-maxage=864000");
  }
};
