/** *********************************************************************
 *
 * Products Action Manager
 *
 * This file contains the action manager for the products page
 * (products-page.ts)
 *
 ********************************************************************* */

import { BaseActionManager } from "./base-action-manager";
import { productsPage } from "../../pages/products-page";

class ProductsActionManager extends BaseActionManager {
  /**
   * Clicks the "Add to Cart" button for the product at the given index.
   * Uses `force: true` to bypass potential visibility issues.
   * @param index - Zero-based index of the product to add.
   */
  addProductToCart(index: number) {
    productsPage.addToCartButton(index).click({ force: true });
  }

  /** Clicks the "Continue Shopping" button in the add-to-cart modal. */
  continueShopping() {
    productsPage.continueShoppingButton.click();
  }

  /** Clicks the "View Cart" button in the add-to-cart modal. */
  goToCart() {
    productsPage.viewCartButton.click();
  }

  /**
   * Types a search term into the search field and submits the search.
   * @param term - The text to search for.
   */
  search(term: string) {
    productsPage.searchField.type(term);
    productsPage.searchButton.click();
  }
}

export const productsActionManager = new ProductsActionManager();
