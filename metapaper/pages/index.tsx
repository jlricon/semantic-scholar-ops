import { useState, useEffect } from "react";

import "../styles/main.css";
import PaperDiv from "../components/PaperDiv";
import ReactGA from "react-ga";
import { States, State, withRedux, Actions } from "../lib/redux";
import { isDev, getPapersForText, origin } from "../lib/lib";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { sendTextQuery } from "./api/get_paper";
import Router from "next/router";
function initGa() {
  ReactGA.initialize("UA-4255500-3");
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const useHome = () => {
  return useSelector(
    (state: State) => ({
      papers: state.papers,
      searchBarMsg:
        state.status === States.IDLE ? state.papers.length : "Searching"
    }),
    shallowEqual
  );
};

const Home = ({ settedSearchString }) => {
  const dispatch = useDispatch();
  const { papers, searchBarMsg } = useHome();
  const [buttonContent, setButtonContent] = useState(settedSearchString);

  function submitForm(event) {
    event.preventDefault();
    // dispatch(searchPapers(buttonContent));
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
          Meta-Search
        </h1>

        <p className="text-center text-2xl">
          Find{" "}
          <span className="text-teal-500 font-bold">
            Systematic reviews and meta-analysis{" "}
          </span>
          that cite a given paper!
        </p>
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
          className="w-full  outline-none"
          placeholder="Search by title or doi, click blue button for meta analysis"
          value={buttonContent}
          onChange={event => setButtonContent(event.target.value)}
        ></input>
        <p>Results found: {searchBarMsg}</p>
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
        </a>
      </div>
    </div>
  );
};

Home.getInitialProps = async ({ reduxStore, query, req }) => {
  // Tick the time once, so we'll have a
  // valid time before first render
  const { s } = query;
  if (s !== undefined && s !== "") {
    const { dispatch, getState } = reduxStore;
    // Call function directly if in server or make URL call
    if (process.env.DB_REST_API_KEY !== undefined) {
      const papers = (await sendTextQuery(s)).data.search_paper;
      dispatch({
        type: Actions.INIT,
        papers: papers,
        host: origin(req)
      });
    } else {
      const papers = await getPapersForText(s, reduxStore.getState().host);
      dispatch({
        type: Actions.RECEIVE_PAPERS,
        papers: papers
      });
    }
  }

  return { settedSearchString: s };
};
export default withRedux(Home);
