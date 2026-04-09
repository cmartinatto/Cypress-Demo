import { generateUserData } from "../../utils/factories/user-data-factory";
import { createAccountViaAPI } from "../../support/api/users";
import { UserData } from "../../interfaces/user-data";

describe("API - Users", () => {
  context("POST /api/createAccount", () => {
    it("should create a new account", { tags: ["TC-API-012", "@smoke"] }, () => {
      const user: UserData = generateUserData();
      cy.request({
        method: "POST",
        url: "/api/createAccount",
        form: true,
        body: {
          name: user.name,
          email: user.email,
          password: user.password,
          title: user.title,
          birth_date: user.birthDate,
          birth_month: user.birthMonth,
          birth_year: user.birthYear,
          firstname: user.firstName,
          lastname: user.lastName,
          company: user.company,
          address1: user.address,
          address2: user.address2,
          country: user.country,
          zipcode: user.zipcode,
          state: user.state,
          city: user.city,
          mobile_number: user.mobile,
        },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(200);
        expect(responseBody.message).to.eq("User created!");
      });
    });

    it("should return responseCode 400 when email already exists", { tags: ["TC-API-013"] }, () => {
      const user: UserData = generateUserData();
      createAccountViaAPI(user);

      cy.request({
        method: "POST",
        url: "/api/createAccount",
        form: true,
        body: {
          name: user.name,
          email: user.email,
          password: user.password,
          title: user.title,
          birth_date: user.birthDate,
          birth_month: user.birthMonth,
          birth_year: user.birthYear,
          firstname: user.firstName,
          lastname: user.lastName,
          company: user.company,
          address1: user.address,
          address2: user.address2,
          country: user.country,
          zipcode: user.zipcode,
          state: user.state,
          city: user.city,
          mobile_number: user.mobile,
        },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(400);
        expect(responseBody.responseCode).to.eq(400);
        expect(responseBody.message).to.eq("Email already exists!");
      });
    });

    it(
      "should return responseCode 405 when using GET instead of POST",
      { tags: ["TC-API-014"] },
      () => {
        cy.request({
          method: "GET",
          url: "/api/createAccount",
          failOnStatusCode: false,
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(405);
          expect(responseBody.detail).to.eq('Method "GET" not allowed.');
        });
      },
    );
  });

  context("GET /api/getUserDetailByEmail", () => {
    let user: UserData;

    before(() => {
      user = generateUserData();
      createAccountViaAPI(user);
    });

    it("should return user details for a valid email", { tags: ["TC-API-015", "@smoke"] }, () => {
      cy.request({
        method: "GET",
        url: "/api/getUserDetailByEmail",
        qs: { email: user.email },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(200);
        expect(responseBody.user).to.exist;
        expect(responseBody.user.email).to.eq(user.email);
      });
    });

    it("should return responseCode 404 for a non-existent email", { tags: ["TC-API-016"] }, () => {
      cy.request({
        method: "GET",
        url: "/api/getUserDetailByEmail",
        qs: { email: `nonexistent_${Date.now()}@nowhere.test` },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(404);
        expect(responseBody.responseCode).to.eq(404);
        expect(responseBody.message).to.eq("Account not found with this email, try another email!");
      });
    });

    it(
      "should return responseCode 400 when email parameter is missing",
      { tags: ["TC-API-017"] },
      () => {
        cy.request({
          method: "GET",
          url: "/api/getUserDetailByEmail",
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(400);
          expect(responseBody.responseCode).to.eq(400);
          expect(responseBody.message).to.include("Bad request");
        });
      },
    );

    it("should return user object with expected fields", { tags: ["TC-API-018"] }, () => {
      cy.request({
        method: "GET",
        url: "/api/getUserDetailByEmail",
        qs: { email: user.email },
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        const returnedUser = responseBody.user;
        expect(returnedUser).to.have.property("id");
        expect(returnedUser).to.have.property("name");
        expect(returnedUser).to.have.property("email");
      });
    });
  });

  context("PUT /api/updateAccount", () => {
    let user: UserData;

    before(() => {
      user = generateUserData();
      createAccountViaAPI(user);
    });

    it(
      "should update the account and return responseCode 200",
      { tags: ["TC-API-019", "@smoke"] },
      () => {
        cy.request({
          method: "PUT",
          url: "/api/updateAccount",
          form: true,
          body: {
            name: user.name,
            email: user.email,
            password: user.password,
            title: user.title,
            birth_date: user.birthDate,
            birth_month: user.birthMonth,
            birth_year: user.birthYear,
            firstname: user.firstName,
            lastname: user.lastName,
            company: "Updated Company",
            address1: user.address,
            address2: user.address2,
            country: user.country,
            zipcode: user.zipcode,
            state: user.state,
            city: user.city,
            mobile_number: user.mobile,
          },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(200);
          expect(responseBody.message).to.eq("User updated!");
        });
      },
    );

    it(
      "should return responseCode 400 when updating a non-existent email",
      { tags: ["TC-API-020"] },
      () => {
        cy.request({
          method: "PUT",
          url: "/api/updateAccount",
          form: true,
          body: {
            name: "Ghost User",
            email: `ghost_${Date.now()}@nowhere.test`,
            password: "Password1!",
          },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(400);
          expect(responseBody.responseCode).to.eq(400);
        });
      },
    );

    it(
      "should return responseCode 405 when using GET instead of PUT",
      { tags: ["TC-API-021"] },
      () => {
        cy.request({
          method: "GET",
          url: "/api/updateAccount",
          failOnStatusCode: false,
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(405);
          expect(responseBody.detail).to.eq('Method "GET" not allowed.');
        });
      },
    );
  });

  context("DELETE /api/deleteAccount", () => {
    it(
      "should delete the account and return responseCode 200",
      { tags: ["TC-API-022", "@smoke"] },
      () => {
        const user: UserData = generateUserData();
        createAccountViaAPI(user);

        cy.request({
          method: "DELETE",
          url: "/api/deleteAccount",
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
          expect(responseBody.message).to.eq("Account deleted!");
        });
      },
    );

    it(
      "should return responseCode 404 when deleting a non-existent account",
      { tags: ["TC-API-023"] },
      () => {
        cy.request({
          method: "DELETE",
          url: "/api/deleteAccount",
          form: true,
          body: {
            email: `ghost_${Date.now()}@nowhere.test`,
            password: "Password1!",
          },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(404);
          expect(responseBody.responseCode).to.eq(404);
          expect(responseBody.message).to.eq("Account not found!");
        });
      },
    );

    it(
      "should return responseCode 405 when using GET instead of DELETE",
      { tags: ["TC-API-424"] },
      () => {
        cy.request({
          method: "GET",
          url: "/api/deleteAccount",
          failOnStatusCode: false,
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(405);
          expect(responseBody.detail).to.eq('Method "GET" not allowed.');
        });
      },
    );
  });
});
