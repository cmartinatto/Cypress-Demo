/** *********************************************************************
 *
 * Header Action Manager
 *
 * This file contains the action manager for the Header Menu
 * (header-menu.ts)
 *
 ********************************************************************* */

import { BaseActionManager } from "./base-action-manager";
import { headerMenu } from "../../pages/header-menu";
import {
  loginInterceptor,
  cartInterceptor,
  deleteAccountInterceptor,
} from "../../interception/interceptors";

class HeaderActionManager extends BaseActionManager {
  /** Clicks the logout button in the header menu. */
  logout() {
    loginInterceptor.set();
    headerMenu.logoutButton.click();
    loginInterceptor.wait();
  }

  /** Clicks the Products link in the header menu. */
  clickProducts() {
    headerMenu.productsButton.click();
  }

  /** Clicks the Cart link in the header menu. */
  clickCart() {
    cartInterceptor.set();
    headerMenu.cartButton.click();
    cartInterceptor.wait();
  }

  /** Clicks the Signup/Login link in the header menu. */
  clickSignupLogin() {
    loginInterceptor.set();
    headerMenu.signupLoginButton.click();
    loginInterceptor.wait();
  }

  /** Clicks the Delete Account button in the header menu. */
  deleteAccount() {
    deleteAccountInterceptor.set();
    headerMenu.deleteAccountButton.click();
    deleteAccountInterceptor.wait();
  }
}

export const headerActionManager = new HeaderActionManager();
