/** *********************************************************************
 *
 * Payment Assertion Manager
 *
 * This file contains the assertion manager for the Payment page
 * (payment-done-page.ts)
 *
 ********************************************************************* */

import { paymentDonePage } from "../../pages/payment-done-page";

class PaymentAssertionManager {
  /**
   * Verifies that the order placed confirmation page is displayed correctly,
   * including the title, congratulations message, download invoice button, and continue button.
   */
  verifyOrderPlaced() {
    paymentDonePage.orderPlacedTitle.should("have.text", "Order Placed!");
    paymentDonePage.congratulationsMessage.should(
      "have.text",
      "Congratulations! Your order has been confirmed!",
    );
    paymentDonePage.downloadInvoiceButton.should("be.visible");
    paymentDonePage.continueButton.scrollIntoView().should("be.visible");
  }
}

export const paymentAssertionManager = new PaymentAssertionManager();
