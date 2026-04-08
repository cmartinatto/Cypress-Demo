/** *********************************************************************
 *
 * Cart Assertion Manager
 *
 * This file contains the assertion manager for the Cart page
 * (cart-page.ts)
 *
 ********************************************************************* */

import { cartPage } from "../../pages/cart-page";

class CartAssertionManager {
  /**
   * Asserts that the cart contains the expected number of products.
   * When `count` is 0, verifies the empty cart message is visible.
   * @param count - Expected number of products in the cart.
   */
  verifyProductCount(count: number) {
    if (count === 0) {
      cartPage.emptyCartMessage.should("be.visible");
    } else {
      cartPage.cartRows.should("have.length", count);
    }
  }
}

export const cartAssertionManager = new CartAssertionManager();
