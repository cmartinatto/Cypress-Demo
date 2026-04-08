/** *********************************************************************
 *
 * Signup / Login page
 *
 * This file represents the Signup / Login page where the user can create
 * a new account or log into an existing one.
 *
 * URL:
 * https://automationexercise.com/login
 *
 ********************************************************************* */

class LoginPage {
  get loginEmailAddressField() {
    cy.log("Login > Email address field");
    return cy.get('[data-qa="login-email"]');
  }

  get loginPasswordField() {
    cy.log("Login > Password field");
    return cy.get('[data-qa="login-password"]');
  }

  get loginButton() {
    cy.log("Login > Login button");
    return cy.get('[data-qa="login-button"]');
  }

  get signupNameField() {
    cy.log("Login > Name field");
    return cy.get('[data-qa="signup-name"]');
  }

  get signupEmailAddressField() {
    cy.log("Login > Email address field");
    return cy.get('[data-qa="signup-email"]');
  }

  get signupButton() {
    cy.log("Login > Signup button");
    return cy.get('[data-qa="signup-button"]');
  }
}

export const loginPage = new LoginPage();
