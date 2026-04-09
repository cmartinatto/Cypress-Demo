import { productsActionManager } from "../../manager/action/products-action-manager";
import { cartActionManager } from "../../manager/action/cart-action-manager";
import { loginActionManager } from "../../manager/action/login-action-manager";
import { paymentActionManager } from "../../manager/action/payment-action-manager";
import { cartPage } from "../../pages/cart-page";
import { checkoutPage } from "../../pages/checkout-page";
import { createAccountViaAPI } from "../../support/api/users";
import { generateUserData } from "../../utils/factories/user-data-factory";
import { generatePaymentData } from "../../utils/factories/payment-data-factory";
import { headerActionManager } from "../../manager/action/header-action-manager";
import { UserData } from "../../interfaces/user-data";
import { cartAssertionManager } from "../../manager/assertion/cart-assertion-manager";
import { paymentAssertionManager } from "../../manager/assertion/payment-assertion-manager";
import { homePageActionManager } from "../../manager/action/home-page-action-manager";

describe("Orders", () => {
  describe("With Existing User", () => {
    let email: string;
    let password: string;

    before(() => {
      cy.env(["VALID_USER_EMAIL", "VALID_USER_PASSWORD"]).then((envs) => {
        email = envs.VALID_USER_EMAIL;
        password = envs.VALID_USER_PASSWORD;
      });
    });

    beforeEach(() => {
      homePageActionManager.navigate();
      headerActionManager.clickSignupLogin();
      loginActionManager.login(email, password);
    });

    it(
      "should complete checkout with existing credentials",
      { tags: ["TC-UI-005", "@smoke", "@debugging"] },
      () => {
        // Preconditions
        const paymentData = generatePaymentData();

        // Test
        headerActionManager.clickProducts();
        productsActionManager.addProductToCart(0);
        productsActionManager.goToCart();
        cartActionManager.proceedToCheckout();
        checkoutPage.commentField.type(paymentData.comment);
        checkoutPage.placeOrderButton.click();
        paymentActionManager.pay(paymentData);

        // Verify Payment page elements are visible
        paymentAssertionManager.verifyOrderPlaced();
      },
    );
  });

  describe("With New User", () => {
    let newUser: UserData;

    before(() => {
      newUser = generateUserData();
      createAccountViaAPI(newUser);
    });

    beforeEach(() => {
      homePageActionManager.navigate();
      headerActionManager.clickSignupLogin();
      loginActionManager.login(newUser.email, newUser.password);
    });

    it("should complete checkout with a new user", { tags: ["TC-UI-006", "@smoke"] }, () => {
      // Preconditions
      const paymentData = generatePaymentData();

      // Test
      headerActionManager.clickProducts();
      productsActionManager.addProductToCart(0);
      productsActionManager.goToCart();
      cartActionManager.proceedToCheckout();
      checkoutPage.commentField.type(paymentData.comment);
      checkoutPage.placeOrderButton.click();
      paymentActionManager.pay(paymentData);

      // Verify Payment page elements are visible
      paymentAssertionManager.verifyOrderPlaced();
    });
  });

  describe("Without Login", () => {
    beforeEach(() => {
      homePageActionManager.navigate();
    });
    it("should add a product to the cart", { tags: ["TC-UI-007", "@smoke", "@debugging"] }, () => {
      // Test
      productsActionManager.addProductToCart(0);
      productsActionManager.goToCart();
      // Verify one product is added to the cart
      cy.url().should("include", "/view_cart");
      cartAssertionManager.verifyProductCount(1);
    });

    it("should add multiple products to the cart", { tags: ["TC-UI-008"] }, () => {
      // Test
      productsActionManager.addProductToCart(0);
      productsActionManager.continueShopping();
      productsActionManager.addProductToCart(1);
      productsActionManager.goToCart();

      // Verify two products are added to the cart
      cy.url().should("include", "/view_cart");
      cartAssertionManager.verifyProductCount(2);
    });

    it("should remove a product from the cart", { tags: ["TC-UI-009"] }, () => {
      // Test
      productsActionManager.addProductToCart(0);
      productsActionManager.goToCart();
      cartActionManager.removeProduct(0);

      // Verify the cart is empty
      cartPage.emptyCartMessage.should("be.visible");
    });
  });
});
