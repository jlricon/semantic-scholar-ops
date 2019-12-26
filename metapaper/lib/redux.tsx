import { createStore, applyMiddleware } from "redux";
import { getPapersForText, getMetaForId } from "./lib";
import thunkMiddleware from "redux-thunk";
import App from "next/app";
import { Provider } from "react-redux";
import React from "react";
export enum Actions {
  REQUEST_STARTED,
  RECEIVE_PAPERS,
  INIT
}
export enum States {
  IDLE,
  SEARCHING
}
export interface State {
  papers: any[];
  status: States;
  host: string;
}
const defaultState: State = {
  papers: [],
  status: States.IDLE,
  host: ""
};
function setState(state: State = defaultState, action) {
  switch (action.type) {
    case Actions.RECEIVE_PAPERS:
      console.log("Papers received");
      return { ...state, papers: action.papers, status: States.IDLE };
    case Actions.REQUEST_STARTED:
      console.log("Request started");
      return { ...state, status: States.SEARCHING };
    case Actions.INIT:
      console.log("Request started");
      return {
        ...state,
        papers: action.papers,
        host: action.host,
        status: States.IDLE
      };
    default:
      return state;
  }
}

const initializeStore = (preloadedState = defaultState) => {
  return createStore(
    setState,
    preloadedState,
    applyMiddleware(
      thunkMiddleware // lets us dispatch() functions
    )
  );
};

function weAreSearching() {
  return { type: Actions.REQUEST_STARTED };
}
function receivePapers(papers) {
  return { type: Actions.RECEIVE_PAPERS, papers: papers };
}
// export function searchPapers(text: string) {
//   return async function(dispatch) {
//     dispatch(weAreSearching());
//     const papers = await getPapersForText(text);
//     dispatch(receivePapers(papers));
//   };
// }
export function searchMetas(paperId: string, addr) {
  return async function(dispatch) {
    dispatch(weAreSearching());
    return getMetaForId(paperId, addr).then(papers =>
      dispatch(receivePapers(papers))
    );
  };
}
export const withRedux = (PageComponent, { ssr = true } = {}) => {
  const WithRedux = ({ initialReduxState, ...props }) => {
    const store = getOrInitializeStore(initialReduxState);
    return (
      <Provider store={store}>
        <PageComponent {...props} />
      </Provider>
    );
  };

  // Make sure people don't use this HOC on _app.js level
  if (process.env.NODE_ENV !== "production") {
    const isAppHoc =
      PageComponent === App || PageComponent.prototype instanceof App;
    if (isAppHoc) {
      throw new Error("The withRedux HOC only works with PageComponents");
    }
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";

    WithRedux.displayName = `withRedux(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithRedux.getInitialProps = async context => {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrInitializeStore();

      // Provide the store to getInitialProps of pages
      context.reduxStore = reduxStore;

      // Run getInitialProps from HOCed PageComponent
      const pageProps =
        typeof PageComponent.getInitialProps === "function"
          ? await PageComponent.getInitialProps(context)
          : {};

      // Pass props to PageComponent
      return {
        ...pageProps,
        initialReduxState: reduxStore.getState()
      };
    };
  }

  return WithRedux;
};

let reduxStore;
const getOrInitializeStore = (initialState = undefined) => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === "undefined") {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!reduxStore) {
    reduxStore = initializeStore(initialState);
  }

  return reduxStore;
};
