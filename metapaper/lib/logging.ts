const LOGGING =
  "http://logs-01.loggly.com/inputs/232d22bd-df00-458d-a952-79189f0cb0e0/tag/http/";
export function loggly(json) {
  fetch(LOGGING, {
    body: JSON.stringify(json),
    method: "POST"
  });
}
