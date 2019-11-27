import { createStore, applyMiddleware } from "redux";
import { getPapersForText, getMetaForId, addr } from "../lib/lib";
import thunkMiddleware from "redux-thunk";

export enum Actions {
  REQUEST_STARTED,
  RECEIVE_PAPERS
}
export enum States {
  IDLE,
  SEARCHING
}
export interface State {
  papers: any[];
  status: States;
}
const defaultState: State = {
  papers: [],
  status: States.IDLE
};
function setState(state: State = defaultState, action) {
  switch (action.type) {
    case Actions.RECEIVE_PAPERS:
      console.log("Papers received");
      return { ...state, papers: action.papers, status: States.IDLE };
    case Actions.REQUEST_STARTED:
      console.log("Request started");
      return { ...state, status: States.SEARCHING };
  }
}

export const store = createStore(
  setState,
  applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
  )
);

function weAreSearching() {
  return { type: Actions.REQUEST_STARTED };
}
function receivePapers(papers) {
  return { type: Actions.RECEIVE_PAPERS, papers: papers };
}
export function searchPapers(text: string) {
  return async function(dispatch) {
    dispatch(weAreSearching());
    const papers = await getPapersForText(text, addr);
    dispatch(receivePapers(papers));
  };
}
export function searchMetas(paperId: string) {
  return async function(dispatch) {
    dispatch(weAreSearching());
    return getMetaForId(paperId, addr).then(papers =>
      dispatch(receivePapers(papers))
    );
  };
}
