import SvgButton from "../components/SvgButton";
import MetaBadge from "../components/MetaBadge";
function PaperDiv({ paper }) {
  return (
    <div className="max-w-6xl rounded overflow-hidden shadow-lg bg-white  md:mx-4 my-1">
      <div className="px-1 md:px-6 py-4">
        <div className="flex flex-row justify-between">
          <MetaBadge isMeta={paper.is_meta}></MetaBadge>
          <a
            href={`https://api.semanticscholar.org/${paper.id}`}
            className="font-bold md:text-lg mb-2 hover:text-teal-500 text-justify pr-3"
          >
            {paper.title} ({paper.pubyear})
          </a>

          <SvgButton id={paper.id}></SvgButton>
        </div>
        <p className="text-gray-700 font-light">{paper.venue}</p>
        <p className="text-gray-700 font-light">
          DOI:{" "}
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
export default PaperDiv;
