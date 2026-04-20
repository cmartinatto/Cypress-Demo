/** *********************************************************************
 *
 * Payment Action Manager
 *
 * This file contains the action manager for the Payment page
 * (payment-page.ts)
 *
 ********************************************************************* */

import { BaseActionManager } from "./base-action-manager";
import { paymentPage } from "../../pages/payment-page";
import { PaymentData } from "../../utils/factories/payment-data-factory";

class PaymentActionManager extends BaseActionManager {
  /**
   * Fills in all payment detail fields without submitting.
   * @param paymentData - Object containing card details (name, number, CVC, expiry month/year).
   */
  fillPaymentDetails(paymentData: PaymentData) {
    paymentPage.nameOnCardField.type(paymentData.nameOnCard);
    paymentPage.cardNumberField.type(paymentData.cardNumber);
    paymentPage.cvcField.type(paymentData.cvc);
    paymentPage.expiryMonthField.type(paymentData.expiryMonth);
    paymentPage.expiryYearField.type(paymentData.expiryYear);
  }

  /**
   * Fills in payment details and clicks the pay button to confirm the order.
   * @param paymentData - Object containing card details (name, number, CVC, expiry month/year).
   */
  pay(paymentData: PaymentData) {
    this.fillPaymentDetails(paymentData);
    paymentPage.payButton.click();
  }
}

export const paymentActionManager = new PaymentActionManager();
