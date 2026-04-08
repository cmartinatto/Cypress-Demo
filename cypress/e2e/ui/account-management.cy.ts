import { loginActionManager } from "../../manager/action/login-action-manager";
import { headerActionManager } from "../../manager/action/header-action-manager";
import { headerAssertionManager } from "../../manager/assertion/header-assertion-manager";
import { signupPage } from "../../pages/signup-page";
import { createAccountViaAPI } from "../../support/api/users";
import { generateUserData } from "../../utils/factories/user-data-factory";
import { UserData } from "../../interfaces/user-data";
import { homePageActionManager } from "../../manager/action/home-page-action-manager";

describe("Account Management", () => {
  describe("With existing account", () => {
    let email: string;
    let password: string;
    let name: string;

    before(() => {
      cy.env(["VALID_USER_EMAIL", "VALID_USER_PASSWORD", "VALID_USER_NAME"]).then((envs) => {
        email = envs.VALID_USER_EMAIL;
        password = envs.VALID_USER_PASSWORD;
        name = envs.VALID_USER_NAME;
      });
    });

    beforeEach(() => {
      homePageActionManager.navigate();
    });

    it("should login with valid credentials", { tags: ["TC-UI-002", "@smoke"] }, () => {
      // Test
      headerActionManager.clickSignupLogin();
      loginActionManager.login(email, password);

      // Verify the user is logged in
      headerAssertionManager.verifyLoggedIn(name);
    });
  });
  describe("With a new account", () => {
    let userData: UserData;

    beforeEach(() => {
      userData = generateUserData();
      homePageActionManager.navigate();
    });

    it("should create a new account", { tags: ["TC-UI-001", "@smoke"] }, () => {
      // Test
      headerActionManager.clickSignupLogin();
      loginActionManager.startSignup(userData.name, userData.email);
      loginActionManager.fillRegistrationForm(userData);
      signupPage.continueButton.click();

      // Verify the new user is logged in
      headerAssertionManager.verifyLoggedIn(userData.name);
    });

    it("should logout successfully", { tags: ["TC-UI-003"] }, () => {
      // Preconditions
      createAccountViaAPI(userData);
      headerActionManager.clickSignupLogin();
      loginActionManager.login(userData.email, userData.password);

      // Test
      headerActionManager.logout();

      // Verify the user is logged out
      headerAssertionManager.verifyLoggedOut();
    });

    it("should delete account", { tags: ["TC-UI-004"] }, () => {
      // Preconditions
      createAccountViaAPI(userData);
      headerActionManager.clickSignupLogin();
      loginActionManager.login(userData.email, userData.password);

      // Test
      headerActionManager.deleteAccount();

      // Verify "Account deleted" label is visible
      signupPage.accountDeletedTitle.should("be.visible");
    });
  });
});
