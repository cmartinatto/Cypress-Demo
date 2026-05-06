/** *********************************************************************
 *
 * Auth Helper
 *
 * Cross-page authentication flows that orchestrate multiple action
 * managers. Kept separate from LoginActionManager so each action
 * manager stays scoped to its own page.
 *
 ********************************************************************* */

import { homePageActionManager } from "../action/home-page-action-manager";
import { headerActionManager } from "../action/header-action-manager";
import { loginActionManager } from "../action/login-action-manager";

/**
 * Logs in using Cypress session caching to avoid repeating the full login flow between tests.
 * The session is keyed by email, so different users get independent cached sessions.
 * @param email - The user's email address (used as the session cache key).
 * @param password - The user's password.
 */
function loginWithSession(email: string, password: string) {
  cy.session(email, () => {
    homePageActionManager.navigate();
    headerActionManager.clickSignupLogin();
    loginActionManager.login(email, password);
  });
}

export const authHelper = { loginWithSession };
