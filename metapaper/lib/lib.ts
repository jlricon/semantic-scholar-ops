// lib
export async function getPapersForText(text, addr) {
  var url = new URL(`${addr}/api/get_paper`);
  var params = new URLSearchParams({
    text: text,
    queryKind: "paper_for_text"
  });
  url.search = params.toString();
  let data = await fetch(url.toString()).then(a => a.json());
  if (data.message === "Internal server error") {
    console.log("Error!");
    data = [];
  }
  return data;
}
export async function getMetaForId(paperId, addr) {
  let data = await fetch(
    `${addr}/api/get_paper?queryKind=meta_for_id&id=${paperId}`
  ).then(a => a.json());
  if (data.message === "Internal server error") {
    console.log("Error!");
    data = [];
  }
  return data;
}
