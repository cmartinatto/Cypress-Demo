/** *********************************************************************
 *
 * Header Menu
 *
 * This file represents the Header Menu, common to all pages in the site.
 * This menu shows the site logo plus the following options:
 *
 * - Home
 * - Products
 * - Cart
 * - Signup / Login
 * - Logout
 * - Delete Account
 * - Test Cases
 * - API Testing
 * - Video Tutorials
 * - Contact us
 * - User login info
 *
 * URL:
 * https://automationexercise.com/*
 *
 ********************************************************************* */

class HeaderMenu {
  get productsButton() {
    cy.log("Header > Products button");
    return cy.get('a[href="/products"]');
  }

  get cartButton() {
    cy.log("Header > Cart button");
    return cy.get('a[href="/view_cart"]');
  }

  get signupLoginButton() {
    cy.log("Header > Signup/Login button");
    return cy.get('a[href="/login"]');
  }

  get logoutButton() {
    cy.log("Header > Logout button");
    return cy.get('a[href="/logout"]');
  }

  get deleteAccountButton() {
    cy.log("Header > Delete Account button");
    return cy.get('a[href="/delete_account"]');
  }

  get loggedInAsText() {
    cy.log("Header > Logged in as text");
    return cy.contains("Logged in as");
  }
}

export const headerMenu = new HeaderMenu();
