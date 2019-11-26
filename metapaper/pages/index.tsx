import { Provider, connect } from "react-redux";
import Home from "../components/Home";
import { store } from "../lib/redux";
function ProvidedHome() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
export default ProvidedHome;
