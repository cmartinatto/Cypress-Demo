import { faker } from "@faker-js/faker";
import { UserData } from "../../interfaces/user-data";

export const generateUserData = (): UserData => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName, provider: `${Date.now()}.test.com` }),
    password: `${faker.internet.password({ length: 8, memorable: true })}A1!`,
    title: "Mr",
    birthDate: faker.number.int({ min: 1, max: 28 }).toString(),
    birthMonth: faker.date.month(),
    birthYear: faker.number.int({ min: 1960, max: 2000 }).toString(),
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: "United States",
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode("#####"),
    mobile: faker.string.numeric(10),
  };
};
