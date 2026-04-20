// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-mochawesome-reporter/register";
// eslint-disable-next-line @typescript-eslint/no-require-imports
(require("@cypress/grep") as { register: () => void }).register();

/**
 * Disables all CSS animations and transitions for every page load.
 * This reduces the fixed wait needed before screenshots (see ANIMATION_SETTLE_MS),
 * since only JS-based animations remain untracked. Also makes UI tests run faster.
 */
Cypress.on("window:before:load", (win) => {
  const style = win.document.createElement("style");
  style.textContent =
    "*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }";
  win.document.head.appendChild(style);
});

// The site uses JS-based animations (not trackable via the Web Animations API),
// so a fixed wait is required before capturing screenshots.
const ANIMATION_SETTLE_MS = 100;

afterEach(function () {
  const isUiSpec = Cypress.spec.relative.replace(/\\/g, "/").startsWith("cypress/e2e/ui/");
  if (isUiSpec && this.currentTest?.state === "passed") {
    cy.wait(ANIMATION_SETTLE_MS);
    cy.screenshot(`${this.currentTest?.fullTitle()}`);
  }
});
