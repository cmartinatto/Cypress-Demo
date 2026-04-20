import { Interceptor } from "../support/interceptor";

export const productsInterceptor = new Interceptor(
  "https://automationexercise.com/products",
  "Products Page interceptor",
  "POST",
);

export const loginInterceptor = new Interceptor(
  "https://automationexercise.com/login",
  "Login Page interceptor",
);

export const cartInterceptor = new Interceptor(
  "https://automationexercise.com/view_cart",
  "Cart Page interceptor",
);

export const deleteAccountInterceptor = new Interceptor(
  "https://automationexercise.com/delete_account",
  "Delente Account interceptor",
);
