/** *********************************************************************
 *
 * Home Page Action Manager
 *
 * This file contains the action manager for the Home page
 * (home-page.ts)
 *
 ********************************************************************* */

import { BaseActionManager } from "./base-action-manager";

class HomePageActionManager extends BaseActionManager {
  /** Navigates to the Home page. */
  navigate() {
    cy.visit("/");
  }
}

export const homePageActionManager = new HomePageActionManager();
