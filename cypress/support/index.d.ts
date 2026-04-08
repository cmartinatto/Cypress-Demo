declare namespace Cypress {
  interface TypeOptions {
    sensitive: boolean;
  }

  interface Chainable {
    addTestContext(context: string | { title: string; value: unknown }): void;
  }

  interface TestConfigOverrides {
    tags?: string | string[];
  }
}
