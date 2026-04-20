/** *********************************************************************
 *
 * Payment Done page
 *
 * This file represents the Payment Done (Order Confirmation) page,
 * shown after a successful payment. It confirms the order was placed.
 *
 * URL:
 * https://automationexercise.com/payment_done/
 *
 ********************************************************************* */

class PaymentDonePage {
  get orderPlacedTitle() {
    cy.log("Payment Done > Order Placed title");
    return cy.get('[data-qa="order-placed"]');
  }

  get congratulationsMessage() {
    cy.log("Payment Done > Congratulations message");
    return cy.get('[data-qa="order-placed"] + p');
  }

  get downloadInvoiceButton() {
    cy.log("Payment Done > Download Invoice button");
    return cy.contains("a", "Download Invoice");
  }

  get continueButton() {
    cy.log("Payment Done > Continue button");
    return cy.get('[data-qa="continue-button"]');
  }
}

export const paymentDonePage = new PaymentDonePage();
