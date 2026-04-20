/** *********************************************************************
 *
 * Products page
 *
 * This file represents the Products page where the user can browse the
 * products on sale and add them to the cart.
 *
 * URL:
 * https://automationexercise.com/products
 *
 ********************************************************************* */

class ProductsPage {
  get searchField() {
    cy.log("Products > Search field");
    return cy.get("#search_product");
  }

  get searchButton() {
    cy.log("Products > Search button");
    return cy.get("#submit_search");
  }

  addToCartButton(index: number) {
    cy.log(`Products > Add to cart button [${index}]`);
    return cy.get(".productinfo a.add-to-cart").eq(index);
  }

  get continueShoppingButton() {
    cy.log("Products > Continue Shopping button (modal)");
    return cy.get("#cartModal button.close-modal");
  }

  get viewCartButton() {
    cy.log("Products > View Cart button (modal)");
    return cy.get('#cartModal a[href="/view_cart"]');
  }
}

export const productsPage = new ProductsPage();
