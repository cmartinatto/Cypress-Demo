/** *********************************************************************
 *
 * Checkout page
 *
 * This file represents the Checkout page where the user reviews their
 * order and places it.
 *
 * URL:
 * https://automationexercise.com/checkout
 *
 ********************************************************************* */

class CheckoutPage {
  get commentField() {
    cy.log("Checkout > Comment field");
    return cy.get("textarea.form-control");
  }

  get placeOrderButton() {
    cy.log("Checkout > Place Order button");
    return cy.get("a.btn.check_out");
  }
}

export const checkoutPage = new CheckoutPage();
