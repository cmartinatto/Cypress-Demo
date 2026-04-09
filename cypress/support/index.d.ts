declare module "cypress-mochawesome-reporter/plugin" {
  function plugin(on: Cypress.PluginEvents): void;
  export = plugin;
}

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
