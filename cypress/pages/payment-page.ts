/** *********************************************************************
 *
 * Payment page
 *
 * This file represents the Payment page where the user enters their
 * card details to complete the order.
 *
 * URL:
 * https://automationexercise.com/payment
 *
 ********************************************************************* */

class PaymentPage {
  get nameOnCardField() {
    cy.log("Payment > Name on card field");
    return cy.get('[data-qa="name-on-card"]');
  }

  get cardNumberField() {
    cy.log("Payment > Card number field");
    return cy.get('[data-qa="card-number"]');
  }

  get cvcField() {
    cy.log("Payment > CVC field");
    return cy.get('[data-qa="cvc"]');
  }

  get expiryMonthField() {
    cy.log("Payment > Expiry month field");
    return cy.get('[data-qa="expiry-month"]');
  }

  get expiryYearField() {
    cy.log("Payment > Expiry year field");
    return cy.get('[data-qa="expiry-year"]');
  }

  get payButton() {
    cy.log("Payment > Pay button");
    return cy.get('[data-qa="pay-button"]');
  }
}

export const paymentPage = new PaymentPage();
