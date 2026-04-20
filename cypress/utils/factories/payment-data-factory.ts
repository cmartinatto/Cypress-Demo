import { faker } from "@faker-js/faker";

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
  comment: string;
}

export const generatePaymentData = (): PaymentData => {
  const futureYear = new Date().getFullYear() + faker.number.int({ min: 1, max: 5 });
  return {
    nameOnCard: faker.person.fullName(),
    cardNumber: faker.finance.creditCardNumber({ issuer: "visa" }),
    cvc: faker.finance.creditCardCVV(),
    expiryMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2, "0"),
    expiryYear: futureYear.toString(),
    comment: faker.lorem.sentence(),
  };
};
