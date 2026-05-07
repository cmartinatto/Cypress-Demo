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
        if (!interception.response) {
          throw new Error(`No response received for interceptor: ${this.tag}`);
        }
        const { statusCode } = interception.response;
        if (statusCode < 200 || statusCode >= 300) {
          throw new Error(
            `Expected 2xx but got ${statusCode}: ${JSON.stringify(interception.response.body)}`,
          );
        }
        return cy.wrap(interception);
      });
  }
}
