// const PercyScript = require("@percy/script");

// PercyScript.run(async (page, percySnapshot) => {
//   await page.goto("http://localhost:3000/");
//   // ensure the page has loaded before capturing a snapshot
//   await page.waitFor(".pb-4");
//   await percySnapshot("homepage");
// });
// PercyScript.run(async (page, percySnapshot) => {
//   await page.goto(
//     "http://localhost:3000/citations_for_doi?doi=10.2139/ssrn.2422269"
//   );
//   // ensure the page has loaded before capturing a snapshot
//   await page.waitFor(10000);
//   await percySnapshot("citations_doi");
// });
// PercyScript.run(async (page, percySnapshot) => {
//   await page.goto(
//     "http://localhost:3000/citations_for_title?title=Aging Hallmarks: The Benefits of Physical Exercise"
//   );
//   // ensure the page has loaded before capturing a snapshot
//   await page.waitFor(10000);
//   await percySnapshot("citations_title");
// });

describe("Integration test with visual testing", function() {
  it("Loads the homepage", function() {
    // Load the page or perform any other interactions with the app.
    cy.visit("http://localhost:3000/");

    // Take a snapshot for visual diffing
    cy.percySnapshot("homepage");
  });
  it("Loads for doi", function() {
    // Load the page or perform any other interactions with the app.
    cy.visit(
      "http://localhost:3000/citations_for_doi?doi=10.2139/ssrn.2422269"
    );

    // Take a snapshot for visual diffing
    cy.percySnapshot("citations_doi");
  });
  it("Loads for title", function() {
    // Load the page or perform any other interactions with the app.
    cy.visit(
      "http://localhost:3000/citations_for_title?title=Aging Hallmarks: The Benefits of Physical Exercise"
    );

    // Take a snapshot for visual diffing
    cy.percySnapshot("citations_title");
  });
});
