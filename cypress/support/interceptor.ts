type Method = "GET" | "POST" | "PUT" | "DELETE";

export class Interceptor {
  private id: number = 0;
  private address: string;
  private tag: string;
  private method?: Method;
  private requestTimeout?: number;
  private responseTimeout?: number;

  constructor(
    address: string,
    tag: string,
    method?: Method | undefined,
    requestTimeout?: number | undefined,
    responseTimeout?: number | undefined,
  ) {
    this.address = address;
    this.tag = tag;
    this.method = method;
    this.requestTimeout = requestTimeout || Cypress.config("requestTimeout");
    this.responseTimeout = responseTimeout || Cypress.config("responseTimeout");
  }

  protected get uniqueTag() {
    return `${this.tag} #${this.id}`;
  }

  set() {
    this.id += 1;
    if (this.method) {
      cy.intercept(this.method, this.address).as(this.uniqueTag);
    } else {
      cy.intercept(this.address).as(this.uniqueTag);
    }
  }

  wait() {
    return cy
      .wait(`@${this.uniqueTag}`, {
        requestTimeout: this.requestTimeout,
        responseTimeout: this.responseTimeout,
      })
      .then((interception) => {
        if (interception.response!.statusCode !== 200) {
          throw new Error(JSON.stringify(interception.response!.body));
        } else {
          return cy.wrap(interception);
        }
      });
  }
}
