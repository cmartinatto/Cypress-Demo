/** *********************************************************************
 *
 * Home page
 *
 * This file represents the Home page, the main landing page of the site.
 * It includes featured products, a slider banner, a subscription section,
 * and a recommended items section.
 *
 * URL:
 * https://automationexercise.com/
 *
 ********************************************************************* */

class HomePage {
  //TODO delete extra elements
  get slider() {
    cy.log("Home > Slider banner");
    return cy.get("#slider");
  }

  get featuredItems() {
    cy.log("Home > Featured items");
    return cy.get(".features_items");
  }

  get subscriptionEmailField() {
    cy.log("Home > Subscription email field");
    return cy.get("#susbscribe_email");
  }

  get subscribeButton() {
    cy.log("Home > Subscribe button");
    return cy.get("#subscribe");
  }

  get subscriptionSuccessMessage() {
    cy.log("Home > Subscription success message");
    return cy.get("#success-subscribe");
  }

  get recommendedItemsSection() {
    cy.log("Home > Recommended items section");
    return cy.get(".recommended_items");
  }

  get recommendedAddToCartButtons() {
    cy.log("Home > Recommended items add-to-cart buttons");
    return cy.get(".recommended_items .add-to-cart");
  }

  recommendedAddToCartButton(index: number) {
    cy.log(`Home > Recommended items add-to-cart button [${index}]`);
    return cy.get(".recommended_items .add-to-cart").eq(index);
  }

  get leftSidebar() {
    cy.log("Home > Left sidebar");
    return cy.get(".left-sidebar");
  }
}

export const homePage = new HomePage();
