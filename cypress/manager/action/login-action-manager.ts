/** *********************************************************************
 *
 * Login Action Manager
 *
 * This file contains the action manager for the Signup / Login page
 * (login-page.ts)
 *
 ********************************************************************* */

import { BaseActionManager } from "./base-action-manager";
import { loginPage } from "../../pages/login-page";
import { signupPage } from "../../pages/signup-page";
import { UserData } from "../../interfaces/user-data";

class LoginActionManager extends BaseActionManager {
  /**
   * Fills in login credentials and submits the login form.
   * @param email - The user's email address.
   * @param password - The user's password.
   */
  login(email: string, password: string) {
    loginPage.loginEmailAddressField.type(email);
    loginPage.loginPasswordField.type(password, { sensitive: true });
    loginPage.loginButton.click();
  }

  /**
   * Fills in the signup initiation form with name and email, then clicks the signup button.
   * @param name - The user's full name.
   * @param email - The user's email address.
   */
  startSignup(name: string, email: string) {
    loginPage.signupNameField.type(name);
    loginPage.signupEmailAddressField.type(email);
    loginPage.signupButton.click();
  }

  /**
   * Fills in the full registration form with the provided user data and submits it.
   * @param data - Object containing all required registration fields.
   */
  fillRegistrationForm(data: UserData) {
    signupPage.mrRadioButton.check();
    signupPage.passwordField.type(data.password);
    signupPage.birthDaySelect.select(data.birthDate);
    signupPage.birthMonthSelect.select(data.birthMonth);
    signupPage.birthYearSelect.select(data.birthYear);
    signupPage.firstNameField.type(data.firstName);
    signupPage.lastNameField.type(data.lastName);
    signupPage.addressField.type(data.address);
    signupPage.countrySelect.select(data.country);
    signupPage.stateField.type(data.state);
    signupPage.cityField.type(data.city);
    signupPage.zipcodeField.type(data.zipcode);
    signupPage.mobileField.type(data.mobile);
    signupPage.createAccountButton.click();
  }
}

export const loginActionManager = new LoginActionManager();
