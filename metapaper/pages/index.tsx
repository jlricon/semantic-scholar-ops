import { useState, useEffect } from "react";

import "../styles/main.css";
import PaperDiv from "../components/PaperDiv";
import ReactGA from "react-ga";
import { States, State, withRedux, Actions } from "../lib/redux";
import { isDev, getPapersForText, origin, getMetaForId } from "../lib/lib";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { sendTextQuery, sendMetaQuery } from "./api/get_paper";
import Router from "next/router";
import Link from "next/link";
function initGa() {
  ReactGA.initialize("UA-4255500-3");
  ReactGA.pageview(window.location.pathname + window.location.search);
}
const getMessage = (search_string, state, papers_length) => {
  if (search_string === undefined || search_string === "") {
    return "";
  } else if (state === States.IDLE) {
    return `Results found: ${papers_length} for "${search_string}"`;
  } else {
    return "Searching...";
  }
};
const useHome = () => {
  return useSelector(
    (state: State) => ({
      papers: state.papers,
      searchBarMsg: getMessage(
        state.search_string,
        state.status,
        state.papers.length
      )
    }),
    shallowEqual
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { papers, searchBarMsg } = useHome();
  const [buttonContent, setButtonContent] = useState("");

  function submitForm(event) {
    event.preventDefault();
    dispatch({ type: Actions.REQUEST_STARTED, search_string: buttonContent });
    Router.push({
      pathname: "/",
      query: { s: buttonContent }
    });
    event.preventDefault();
  }
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
        <p className="text-center text-2xl">
          Find{" "}
          <span className="text-teal-500 font-bold">
            Systematic reviews and meta-analysis{" "}
          </span>
          that cite a given paper!
          <p className="text-red-500 text-md">
            Currently the system is down as it got little use :(
          </p>
        </p>{" "}
      </div>
      <form
        className="py-3 px-4 bg-white mt-8 rounded-full shadow-md
      focus:shadow-xl border-transparent mx-auto"
        style={{ minWidth: "80%" }}
        onSubmit={event => {
          submitForm(event);
        }}
      >
        <input
          id="input-box"
          className="w-full  outline-none"
          placeholder="Search by title or doi, click blue button for meta analysis"
          value={buttonContent}
          onChange={event => setButtonContent(event.target.value)}
        ></input>
        <p>{searchBarMsg}</p>
      </form>

      <div className="flex flex-col items-stretch py-4 mx-auto">
        {papers.map((value, index) => {
          return <PaperDiv paper={value} key={index} />;
        })}
      </div>
      <div className="justify-center text-center pb-4">
        <p className="font-medium">
          Built using Semantic Scholar's dataset. If you found this useful and
          want to cite this tool, get in touch!
        </p>
        <a
          className="pl-2 hover:text-teal-300 font-medium text-lg"
          href="https://twitter.com/ArtirKel"
        >
          By Jose Luis Ricon
        </a>{" "}
        (
        <a className="hover:text-teal-300" href="mailto:jose@ricon.xyz">
          email
        </a>
        )
        <p>
          <Link href="/about">
            <a>Documentation / About</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

Home.getInitialProps = async ({ reduxStore, query, req, res }) => {
  const { s, meta_for_id } = query;
  const { dispatch, getState } = reduxStore;
  if (s !== undefined && meta_for_id !== undefined) {
    console.log("User tried to set both search params");
    throw "Only one of the search parameters can be defined";
  }
  if (s !== undefined && s !== "") {
    // Call function directly if in server or make URL call
    let papers;
    if (process.browser !== true) {
      papers = (await sendTextQuery(s)).data.search_paper;
    } else {
      papers = await getPapersForText(s, getState().host);
    }
    dispatch({
      type: Actions.RECEIVE_PAPERS,
      papers: papers,
      search_string: s
    });
  } else {
    dispatch({
      type: Actions.RECEIVE_PAPERS,
      papers: [],
      search_string: ""
    });
  }
  if (meta_for_id !== undefined && meta_for_id !== "") {
    // Call function directly if in server or make URL call
    let papers;
    if (process.browser !== true) {
      papers = (await sendMetaQuery(meta_for_id)).data.search_metas_for_id;
    } else {
      papers = await getMetaForId(meta_for_id, getState().host);
    }
    dispatch({
      type: Actions.RECEIVE_PAPERS,
      papers: papers,
      search_string: meta_for_id
    });
  }
  if (process.browser !== true) {
    dispatch({ type: Actions.SET_HOST, host: origin(req) });
    res.setHeader("Cache-Control", "max-age=0, s-maxage=864000");
  }

  return {};
};
export default withRedux(Home);
