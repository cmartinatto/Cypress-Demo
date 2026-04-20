/** *********************************************************************
 *
 * Cart Action Manager
 *
 * This file contains the action manager for the Cart page
 * (cart-page.ts)
 *
 ********************************************************************* */

import { BaseActionManager } from "./base-action-manager";
import { cartPage } from "../../pages/cart-page";

class CartActionManager extends BaseActionManager {
  /**
   * Clicks the remove button for the product at the given index.
   * @param index - Zero-based index of the product row to remove.
   */
  removeProduct(index: number) {
    cartPage.removeButton(index).click();
  }

  /** Clicks the proceed to checkout button. */
  proceedToCheckout() {
    cartPage.proceedToCheckoutButton.click();
  }
}

export const cartActionManager = new CartActionManager();
