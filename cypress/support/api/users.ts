import { UserData } from "../../interfaces/user-data";

/**
 * Creates a test account directly via the API so UI tests that
 * require an existing account don't have to go through the full
 * registration flow every time.
 *
 * Uses cy.window().fetch() instead of cy.request() so the HTTP call
 * is made from the actual browser context. This is required because
 * cy.request() runs from Node.js and has a different TLS fingerprint,
 * which causes Cloudflare to redirect the request in CI environments.
 * Callers must ensure cy.visit() has been called before invoking this.
 */
export const createAccountViaAPI = (userData: UserData) => {
  const formBody = new URLSearchParams({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    title: userData.title,
    birth_date: userData.birthDate,
    birth_month: userData.birthMonth,
    birth_year: userData.birthYear,
    firstname: userData.firstName,
    lastname: userData.lastName,
    company: userData.company,
    address1: userData.address,
    address2: userData.address2,
    country: userData.country,
    zipcode: userData.zipcode,
    state: userData.state,
    city: userData.city,
    mobile_number: userData.mobile,
  }).toString();

  cy.window().then((win) =>
    win.fetch("/api/createAccount", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    })
  );
};
