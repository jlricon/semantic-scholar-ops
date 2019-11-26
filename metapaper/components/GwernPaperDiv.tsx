function GwernPaperDiv({ paper }) {
  return (
    <div className="max-w-6xl rounded overflow-hidden shadow-lg bg-white mx-4 my-1">
      <div className="px-6 py-4">
        <div className="flex flex-row justify-between">
          <a
            href={`https://api.semanticscholar.org/${paper.id}`}
            className="font-bold text-xl mb-2 hover:text-teal-500 text-justify pr-3"
          >
            {paper.title} ({paper.pubyear})
          </a>
        </div>
        <p className="text-gray-700 font-light">{paper.venue}</p>
        <p className="text-gray-700 font-light">
          Semantic scholar id: {paper.id} | DOI:{" "}
          <a
            href={`https://doi.org/${paper.doi}`}
            className="font-light  mb-2 hover:text-teal-500 text-justify pr-3"
          >
            {paper.doi}
          </a>
        </p>
        <p className="text-gray-700 text-base h-64 overflow-y-scroll text-justify py-2 ">
          {paper.paper_abstract}
        </p>
      </div>
    </div>
  );
}
export default GwernPaperDiv;
