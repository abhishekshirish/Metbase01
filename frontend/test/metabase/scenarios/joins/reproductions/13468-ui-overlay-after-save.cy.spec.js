import { restore, openOrdersTable, visualize } from "__support__/e2e/helpers";

describe("issue 13468", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/dataset").as("dataset");
    restore();
    cy.signInAsAdmin();
  });

  it("should not show run overlay after save on a joined question (metabase#13468)", () => {
    openOrdersTable({ mode: "notebook" });

    cy.findByText("Join data").click();
    cy.findByText("Products").click();

    visualize();

    saveQuestion();

    // Cypress cannot click elements that are blocked by an overlay so this will immediately fail if the issue is not fixed
    cy.findByText("110.93").click();
    cy.findByText("Filter by this value");
  });
});

function saveQuestion() {
  cy.findByText("Save").click();
  cy.button("Save").click();
  cy.button("Not now").click();
}
