describe("API - Products", () => {
  context("GET /api/productsList", () => {
    it(
      "should return 200 and a list of products",
      { tags: ["TC-API-025", "@smoke", "@debugging"] },
      () => {
        cy.request({
          method: "GET",
          url: "/api/productsList",
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(200);
          expect(responseBody.products).to.be.an("array").and.not.be.empty;
        });
      },
    );

    it(
      "should return responseCode 405 when using POST instead of GET",
      { tags: ["TC-API-026"] },
      () => {
        cy.request({
          method: "POST",
          url: "/api/productsList",
          failOnStatusCode: false,
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(405);
          expect(responseBody.message).to.eq("This request method is not supported.");
        });
      },
    );

    it("should return products with required fields", { tags: ["TC-API-027"] }, () => {
      cy.request({
        method: "GET",
        url: "/api/productsList",
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        const firstProduct = responseBody.products[0];
        expect(firstProduct).to.have.property("id");
        expect(firstProduct).to.have.property("name");
        expect(firstProduct).to.have.property("price");
        expect(firstProduct).to.have.property("brand");
        expect(firstProduct).to.have.property("category");
      });
    });
  });

  context("GET /api/brandsList", () => {
    it("should return 200 and a list of brands", { tags: ["TC-API-029", "@smoke"] }, () => {
      cy.request({
        method: "GET",
        url: "/api/brandsList",
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        expect(response.status).to.eq(200);
        expect(responseBody.responseCode).to.eq(200);
        expect(responseBody.brands).to.be.an("array").and.not.be.empty;
      });
    });

    it(
      "should return responseCode 405 when using PUT instead of GET",
      { tags: ["TC-API-030"] },
      () => {
        cy.request({
          method: "PUT",
          url: "/api/brandsList",
          failOnStatusCode: false,
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(405);
          expect(responseBody.message).to.eq("This request method is not supported.");
        });
      },
    );

    it("should return brands with id and brand fields", { tags: ["TC-API-031"] }, () => {
      cy.request({
        method: "GET",
        url: "/api/brandsList",
      }).then((response) => {
        const responseBody =
          typeof response.body === "string" ? JSON.parse(response.body) : response.body;
        const firstBrand = responseBody.brands[0];
        expect(firstBrand).to.have.property("id");
        expect(firstBrand).to.have.property("brand");
      });
    });
  });

  context("POST /api/searchProduct", () => {
    it(
      "should return products matching the search term",
      { tags: ["TC-API-032", "@smoke"] },
      () => {
        cy.request({
          method: "POST",
          url: "/api/searchProduct",
          form: true,
          body: { search_product: "top" },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(200);
          expect(responseBody.products).to.be.an("array").and.not.be.empty;
        });
      },
    );

    it(
      "should return responseCode 400 when search_product parameter is missing",
      { tags: ["TC-API-033"] },
      () => {
        cy.request({
          method: "POST",
          url: "/api/searchProduct",
          form: true,
          body: {},
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(400);
          expect(responseBody.message).to.include("Bad request");
        });
      },
    );

    it(
      "should return responseCode 405 when using GET instead of POST",
      { tags: ["TC-API-034"] },
      () => {
        cy.request({
          method: "GET",
          url: "/api/searchProduct",
          failOnStatusCode: false,
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
      "should return an empty products list for an unmatched search term",
      { tags: ["TC-API-035"] },
      () => {
        cy.request({
          method: "POST",
          url: "/api/searchProduct",
          form: true,
          body: { search_product: "xyznotaproduct12345" },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(response.status).to.eq(200);
          expect(responseBody.responseCode).to.eq(200);
          expect(responseBody.products).to.be.an("array").and.have.length(0);
        });
      },
    );

    it(
      "should return a body with responseCode and products properties",
      { tags: ["TC-API-037"] },
      () => {
        cy.request({
          method: "POST",
          url: "/api/searchProduct",
          form: true,
          body: { search_product: "dress" },
        }).then((response) => {
          const responseBody =
            typeof response.body === "string" ? JSON.parse(response.body) : response.body;
          expect(responseBody).to.have.property("responseCode");
          expect(responseBody).to.have.property("products");
        });
      },
    );
  });
});
