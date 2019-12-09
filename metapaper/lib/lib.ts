import { QueryKind } from "./query_kinds";

// lib
export function getPapersForText(text, addr) {
  var url = new URL(`${addr}/api/get_paper`);
  var params = new URLSearchParams({
    text: text,
    queryKind: QueryKind.paper_for_text
  });
  url.search = params.toString();
  return fetch(url.toString())
    .then(a => a.json())
    .then(json => {
      if (json.message === "Internal server error") {
        console.log("Error!");
        return [];
      }
      return json;
    })
    .catch(err => {
      console.log(err);
      return [];
    });
}
export async function getMetaForId(paperId, addr) {
  let data = await fetch(
    `${addr}/api/get_paper?queryKind=${QueryKind.meta_for_id}&id=${paperId}`
  ).then(a => a.json());
  if (data.message === "Internal server error") {
    console.log("Error!");
    data = [];
  }
  return data;
}

export const isDev = process.env.NODE_ENV !== "production";
export const addr = isDev ? "http://localhost:3000" : "https://ricon.dev";
