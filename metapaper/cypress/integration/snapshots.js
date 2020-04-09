/* eslint-disable no-undef */
describe("Integration test with visual testing", function() {
  it("Loads the homepage", function() {
    // Load the page or perform any other interactions with the app.
    cy.visit("http://localhost:3000/");

    // Take a snapshot for visual diffing
    cy.percySnapshot("homepage");
  });
  it("Direct search", function() {
    // Load the page or perform any other interactions with the app.
    cy.visit("http://localhost:3000/", {
      qs: { s: "Aging Hallmarks: The Benefits of Physical Exercise" }
    });
    // Take a snapshot for visual diffing
    cy.percySnapshot("direct_search");
  });
  it("Homepage and direct search", function() {
    // Load the page or perform any other interactions with the app.
    cy.visit("http://localhost:3000/");
    cy.get("#input-box").type(
      "Aging Hallmarks: The Benefits of Physical Exercise{enter}"
    );
    // Take a snapshot for visual diffing
    cy.percySnapshot("homepage_direct_search_wait");
    cy.wait(8000);
    cy.percySnapshot("homepage_direct_search");
  });
  it("Loads for doi", function() {
    // Load the page or perform any other interactions with the app.
    cy.visit(
      "http://localhost:3000/citations_for_doi?doi=10.1016/j.cell.2013.05.039"
    );

    // Take a snapshot for visual diffing
    cy.percySnapshot("citations_doi");
  });
  it("Loads for title", function() {
    // Load the page or perform any other interactions with the app.
    cy.visit(
      "http://localhost:3000/citations_for_title?title=The Hallmarks of Aging"
    );

    // Take a snapshot for visual diffing
    cy.percySnapshot("citations_title");
  });

  it("Loads metas for id from icon", function() {
    cy.visit("http://localhost:3000/", {
      qs: { s: "Aging Hallmarks: The Benefits of Physical Exercise" }
    });
    cy.wait(8000);
    cy.get(".bg-blue-500").click();
    cy.wait(5000);
    cy.percySnapshot("meta_for_id_from_icon");
  });
});
