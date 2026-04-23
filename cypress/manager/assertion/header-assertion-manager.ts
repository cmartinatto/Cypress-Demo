/** *********************************************************************
 *
 * Header Assertion Manager
 *
 * This file contains the assertion manager for the Header Menu
 * (header-menu.ts)
 *
 ********************************************************************* */

import { headerMenu } from "../../pages/header-menu";

class HeaderAssertionManager {
  /** Asserts that the logout button and "Logged in as {username}" text are visible, confirming the user is authenticated. */
  verifyLoggedIn(username: string) {
    headerMenu.logoutButton.should("be.visible");
    headerMenu.loggedInAsText.should("be.visible").and("contain", username);
  }

}

export const headerAssertionManager = new HeaderAssertionManager();
