import { faker } from "@faker-js/faker";
import { generateUserData } from "../../utils/factories/user-data-factory";
import { createAccountViaAPI } from "../../support/api/users";
import { UserData } from "../../interfaces/user-data";

describe("API - Login (POST /api/verifyLogin)", () => {
  let user: UserData;
  let wrongPassword: string;
  let nonExistentEmail: string;
  let invalidEmail: string;
  let invalidPassword: string;

  before(() => {
    user = generateUserData();
    createAccountViaAPI(user);
    wrongPassword = `${faker.internet.password({ length: 8, memorable: true })}X9!`;
    nonExistentEmail = faker.internet.email({
      provider: `${Date.now()}.nowhere.test`,
    });
    invalidEmail = faker.internet.email({
      provider: `${Date.now()}.invalid.test`,
    });
    invalidPassword = `${faker.internet.password({ length: 8, memorable: true })}Z9!`;
  });

  context("Valid credentials", () => {
    it(
      "should return 200 and responseCode 200 with correct credentials",
      { tags: ["TC-API-001", "@smoke"] },
      () => {
        cy.request({
          method: "POST",
          url: "/api/verifyLogin",
          form: true,
          body: {
            email: user.email,
            password: user.password,
          },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(200);
          expect(responseBody.message).to.eq("User exists!");
        });
      },
    );
  });

  context("Invalid credentials", () => {
    it("should return responseCode 404 with wrong password", { tags: ["TC-API-002"] }, () => {
      cy.request({
        method: "POST",
        url: "/api/verifyLogin",
        form: true,
        body: {
          email: user.email,
          password: wrongPassword,
        },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(404);
        expect(responseBody.message).to.eq("User not found!");
      });
    });

    it("should return responseCode 404 with a non-existent email", { tags: ["TC-API-003"] }, () => {
      cy.request({
        method: "POST",
        url: "/api/verifyLogin",
        form: true,
        body: {
          email: nonExistentEmail,
          password: user.password,
        },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(404);
        expect(responseBody.message).to.eq("User not found!");
      });
    });

    it(
      "should return responseCode 404 with both email and password wrong",
      { tags: ["TC-API-004"] },
      () => {
        cy.request({
          method: "POST",
          url: "/api/verifyLogin",
          form: true,
          body: {
            email: invalidEmail,
            password: invalidPassword,
          },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(404);
          expect(responseBody.message).to.eq("User not found!");
        });
      },
    );
  });

  context("Missing parameters", () => {
    it("should return responseCode 400 when email is missing", { tags: ["TC-API-005"] }, () => {
      cy.request({
        method: "POST",
        url: "/api/verifyLogin",
        form: true,
        body: {
          password: user.password,
        },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(400);
        expect(responseBody.message).to.include("Bad request");
      });
    });

    it("should return responseCode 400 when password is missing", { tags: ["TC-API-006"] }, () => {
      cy.request({
        method: "POST",
        url: "/api/verifyLogin",
        form: true,
        body: {
          email: user.email,
        },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(400);
        expect(responseBody.message).to.include("Bad request");
      });
    });

    it("should return responseCode 400 when body is empty", { tags: ["TC-API-007"] }, () => {
      cy.request({
        method: "POST",
        url: "/api/verifyLogin",
        form: true,
        body: {},
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(400);
        expect(responseBody.message).to.include("Bad request");
      });
    });
  });

  context("Unsupported HTTP methods", () => {
    it(
      "should return responseCode 405 when using GET instead of POST",
      { tags: ["TC-API-008"] },
      () => {
        cy.request({
          method: "GET",
          url: "/api/verifyLogin",
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(405);
          expect(responseBody.message).to.eq("This request method is not supported.");
        });
      },
    );

    it(
      "should return responseCode 405 when using DELETE instead of POST",
      { tags: ["TC-API-009"] },
      () => {
        cy.request({
          method: "DELETE",
          url: "/api/verifyLogin",
          form: true,
          body: {
            email: user.email,
            password: user.password,
          },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(405);
          expect(responseBody.message).to.eq("This request method is not supported.");
        });
      },
    );
  });

  context("Response structure", () => {
    it(
      "should return a body containing responseCode and message properties",
      { tags: ["TC-API-010"] },
      () => {
        cy.request({
          method: "POST",
          url: "/api/verifyLogin",
          form: true,
          body: {
            email: user.email,
            password: user.password,
          },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(responseBody).to.have.property("responseCode");
          expect(responseBody).to.have.property("message");
        });
      },
    );

    it("should return Content-Type JSON", { tags: ["TC-API-011"] }, () => {
      cy.request({
        method: "POST",
        url: "/api/verifyLogin",
        form: true,
        body: {
          email: user.email,
          password: user.password,
        },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(200);
        expect(responseBody.message).to.eq("User exists!");
      });
    });
  });
});
