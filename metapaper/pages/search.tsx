import { Provider, connect } from "react-redux";
import Home from "../components/Home";
import { store } from "../lib/redux";
import { NextPageContext } from "next";
import { sendTextQuery } from "../pages/api/get_paper";
function ProvidedHome() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
export default ProvidedHome;
ProvidedHome.getInitialProps = async function(context: NextPageContext) {
  const { q } = context.query;
  const { res } = context;
  const papers = sendTextQuery(q as string);
  console.log(papers);
  // So that we only ever call the same paper once
  papers.then(jsonified => {
    if (!(jsonified === { message: "Internal server error" })) {
      res.setHeader("Cache-Control", "max-age=0, s-maxage=864000");
      console.log(jsonified);
      return { papers: [] };
    }

    return { papers: [jsonified.data.search_paper] };
  });
};
