// import Layout from "../components/layout";

import { useState, useEffect } from "react";
import { getPapersForText, getMetaForId } from "../lib/lib";
import "../styles/main.css";
import PaperDiv from "../components/PaperDiv";
const dev = process.env.NODE_ENV !== "production";
const addr = dev ? "http://localhost:3000" : "https://ricon.dev";
function Home() {
  const [papers, setPapers] = useState([]);
  const [resultsN, setResultN] = useState("");
  const [buttonContent, setButtonContent] = useState("");
  const [paperId, setPaperId] = useState("");
  const [fetchMode, setFetchMode] = useState("search");
  async function getData() {
    if (fetchMode === "search") {
      return await getPapersForText(paperId, addr);
    } else {
      return await getMetaForId(paperId, addr);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      let data = await getData();

      setPapers(data);
      setResultN(data.length);
    };
    fetchData();
  }, [paperId]);
  const handleSubmit = event => {
    setFetchMode("search");
    setPaperId(buttonContent);
    setResultN("Searching...");
    event.preventDefault();
  };
  return (
    <div
      className="flex flex-col bg-gray-300 h-full"
      style={{ minHeight: "100vh" }}
    >
      <div className="mx-auto">
        <h1 className="font-bold  text-4xl md:text-6xl text-center text-gray-800 ">
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
        onSubmit={handleSubmit}
      >
        <input
          className="w-full  outline-none"
          placeholder="Search by title or doi, click blue button for meta analysis"
          value={buttonContent}
          onChange={event => setButtonContent(event.target.value)}
        ></input>
        <p>Results found: {resultsN}</p>
      </form>

      <div className="flex flex-col items-stretch py-4 mx-auto">
        {papers.map((value, index) => {
          return (
            <PaperDiv
              paper={value}
              key={index}
              paperIdSetter={setPaperId}
              modeSetter={setFetchMode}
              resultNSetter={setResultN}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
