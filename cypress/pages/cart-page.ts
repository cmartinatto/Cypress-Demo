/** *********************************************************************
 *
 * Cart page
 *
 * This file represents the Cart page where the user can see the items
 * added to the cart.
 *
 * URL:
 * https://automationexercise.com/view_cart
 *
 ********************************************************************* */

class CartPage {
  get cartRows() {
    cy.log("Cart > Cart rows");
    return cy.get("#cart_info_table tbody tr");
  }

  get cartProductNames() {
    cy.log("Cart > Product names");
    return cy.get(".cart_description h4 a");
  }

  get removeButtons() {
    cy.log("Cart > Remove buttons");
    return cy.get("a.cart_quantity_delete");
  }

  removeButton(index: number) {
    cy.log(`Cart > Remove button [${index}]`);
    return cy.get("a.cart_quantity_delete").eq(index);
  }

  get proceedToCheckoutButton() {
    cy.log("Cart > Proceed to Checkout button");
    return cy.get("a.btn.check_out");
  }

  get emptyCartMessage() {
    cy.log("Cart > Empty cart message");
    return cy.get("#empty_cart");
  }
}

export const cartPage = new CartPage();
