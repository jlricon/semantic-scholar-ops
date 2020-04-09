import { withRedux, Actions } from "../lib/redux";
import { useDispatch } from "react-redux";
import Router from "next/router";

function SvgButton({ id }) {
  const dispatch = useDispatch();
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white 
    font-bold  rounded-full outline-none border-transparent focus:outline-none
    items-center w-10 h-10
    "
      onClick={event => {
        event.preventDefault();
        dispatch({
          type: Actions.REQUEST_STARTED,
          search_string: id
        });
        Router.push({
          pathname: "/",
          query: { meta_for_id: id }
        });
        event.preventDefault();
      }}
    >
      <svg
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current w-10 h-10 py-2"
      >
        <path
          d="M12.906 14.32a8 8 0 111.414-1.414l5.337 5.337-1.414 1.414-5.337-5.337zM8 14A6 6 0 108 2a6 6 0 000 12z"
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
}

export default SvgButton;
