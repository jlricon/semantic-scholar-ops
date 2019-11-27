import { useState, useEffect } from "react";

import "../styles/main.css";
import PaperDiv from "../components/PaperDiv";
import ReactGA from "react-ga";
import { searchPapers, States, State } from "../lib/redux";
import { isDev } from "../lib/lib";
import { connect } from "react-redux";
function initGa() {
  ReactGA.initialize("UA-4255500-3");
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function stateToProps(state: State = { papers: [], status: States.IDLE }) {
  const { papers } = state;
  const searchBarMsg =
    state.status === States.IDLE ? papers.length : "Searching";

  return { papers, searchBarMsg };
}

function Home({ papers, searchBarMsg, dispatch }) {
  const [buttonContent, setButtonContent] = useState("");
  function submitForm(event) {
    event.preventDefault();
    dispatch(searchPapers(buttonContent));
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
        onSubmit={event => submitForm(event)}
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
}
export default connect(stateToProps)(Home);
