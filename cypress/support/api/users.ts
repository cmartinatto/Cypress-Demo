import { UserData } from "../../interfaces/user-data";

/**
 * Creates a test account directly via the API so UI tests that
 * require an existing account don't have to go through the full
 * registration flow every time.
 */
export const createAccountViaAPI = (userData: UserData) => {
  cy.request({
    method: "POST",
    url: "/api/createAccount",
    form: true,
    body: {
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
    },
  });
};
