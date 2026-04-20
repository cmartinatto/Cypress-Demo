/** *********************************************************************
 *
 * Signup Page
 *
 * This file represents the account registration form shown after
 * clicking "Signup" on the login page. It contains the Account
 * Information and Address Information sections.
 *
 * URL:
 * https://automationexercise.com/signup
 *
 ********************************************************************* */

class SignupPage {
  get mrRadioButton() {
    cy.log("Signup > Mr radio button");
    return cy.get("#id_gender1");
  }

  get passwordField() {
    cy.log("Signup > Password field");
    return cy.get('[data-qa="password"]');
  }

  get birthDaySelect() {
    cy.log("Signup > Birth day");
    return cy.get('[data-qa="days"]');
  }

  get birthMonthSelect() {
    cy.log("Signup > Birth month");
    return cy.get('[data-qa="months"]');
  }

  get birthYearSelect() {
    cy.log("Signup > Birth year");
    return cy.get('[data-qa="years"]');
  }

  get firstNameField() {
    cy.log("Signup > First name");
    return cy.get('[data-qa="first_name"]');
  }

  get lastNameField() {
    cy.log("Signup > Last name");
    return cy.get('[data-qa="last_name"]');
  }

  get addressField() {
    cy.log("Signup > Address");
    return cy.get('[data-qa="address"]');
  }

  get countrySelect() {
    cy.log("Signup > Country");
    return cy.get('[data-qa="country"]');
  }

  get stateField() {
    cy.log("Signup > State");
    return cy.get('[data-qa="state"]');
  }

  get cityField() {
    cy.log("Signup > City");
    return cy.get('[data-qa="city"]');
  }

  get zipcodeField() {
    cy.log("Signup > Zipcode");
    return cy.get('[data-qa="zipcode"]');
  }

  get mobileField() {
    cy.log("Signup > Mobile");
    return cy.get('[data-qa="mobile_number"]');
  }

  get createAccountButton() {
    cy.log("Signup > Create Account button");
    return cy.get('[data-qa="create-account"]');
  }

  get accountDeletedTitle() {
    cy.log("Signup > Account Deleted title");
    return cy.get('[data-qa="account-deleted"]');
  }

  get continueButton() {
    cy.log("Signup > Continue button");
    return cy.get('[data-qa="continue-button"]');
  }
}

export const signupPage = new SignupPage();
