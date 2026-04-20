# Cypress Demo

A Cypress test automation framework built as a portfolio project, covering UI and API testing for [automationexercise.com](https://automationexercise.com). Designed with scalability and maintainability in mind.

![Cypress](https://img.shields.io/badge/Cypress-15.x-69D3A7?logo=cypress&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)

---

## Architecture

The framework is organized around three layers:

```
Test (e2e)  →  Action Manager  →  Page Object  →  Selector
```

- **Page Objects** (`cypress/pages/`) expose element selectors as typed getters.
- **Action Managers** (`cypress/manager/action/`) compose page interactions into reusable business-level steps (e.g., `loginActionManager.login(email, password)`).
- **Tests** (`cypress/e2e/`) orchestrate action managers and assert outcomes — no selectors or raw Cypress commands leak into test files.

This separation means selector changes touch only one file, and multi-step flows are reusable across tests.

---

## Design patterns

### Page Object Model

Each page is a class with getter methods returning Cypress chainables. Selectors use `data-qa` attributes to decouple tests from styling and structure.

```ts
// cypress/pages/login-page.ts
class LoginPage {
  get emailField() {
    return cy.logEl("Login > Email field").get('[data-qa="login-email"]');
  }
  get passwordField() {
    return cy.logEl("Login > Password field").get('[data-qa="login-password"]');
  }
  get loginButton() {
    return cy.logEl("Login > Submit button").get('[data-qa="login-button"]');
  }
}
export const loginPage = new LoginPage();
```

### Action Manager

Action managers sit above page objects and encapsulate multi-step user flows. All extend a `BaseActionManager` with shared utilities.

```ts
// cypress/manager/action/login-action-manager.ts
class LoginActionManager extends BaseActionManager {
  navigate() { ... }

  login(email: string, password: string) {
    loginPage.emailField.type(email);
    loginPage.passwordField.type(password, { sensitive: true }); // masked in logs
    loginPage.loginButton.click();
  }
}
export const loginActionManager = new LoginActionManager();
```

### Factory Pattern

Test data is generated with [Faker.js](https://fakerjs.dev/) to avoid hardcoded fixtures and prevent data collisions between runs.

```ts
// cypress/utils/factories/user-data-factory.ts
export function generateUserData(): UserData {
  return {
    name: faker.person.fullName(),
    email: `test_${Date.now()}@example.com`,
    password: faker.internet.password(),
    // ...
  };
}
```

### API Setup Helpers

Accounts and preconditions that aren't under test are created directly via API, keeping UI tests focused and fast.

```ts
// cypress/support/api/users.ts
createAccount(userData); // sets up state without touching the UI
loginActionManager.navigate();
loginActionManager.login(userData.email, userData.password);
```

### Network Interceptor Abstraction

A custom `Interceptor` class wraps `cy.intercept` with auto-generated aliases, configurable timeouts, and built-in status code assertions.

```ts
// cypress/support/interceptor.ts
const interceptor = new Interceptor({ method: "POST", url: "/api/verifyLogin" });
interceptor.intercept();
// ... trigger request
interceptor.wait().its("response.statusCode").should("eq", 200);
```

---

## Test coverage

| Layer | Spec | Scope |
|---|---|---|
| UI | `account-management.cy.ts` | Sign up, login, logout, delete account |
| UI | `orders.cy.ts` | Add/remove products, cart, checkout, payment |
| API | `login.cy.ts` | `POST /api/verifyLogin` — happy path, error cases, edge cases |
| API | `products.cy.ts` | `GET /api/productsList`, `GET /api/brandsList`, `POST /api/searchProduct` |
| API | `users.cy.ts` | CRUD on user accounts — create, read, update, delete |

---

## Project structure

```
cypress/
├── e2e/
│   ├── api/          # API test specs
│   └── ui/           # UI test specs
├── pages/            # Page Object classes
├── manager/
│   └── action/       # Action Manager classes
├── utils/
│   └── factories/    # Test data factories (Faker.js)
├── support/
│   ├── api/          # API setup helpers
│   ├── commands.ts   # Custom Cypress commands
│   ├── interceptor.ts# Network interception abstraction
│   └── e2e.ts        # Global hooks and plugin registration
├── config/           # Per-environment config (dev / qa / prod)
├── suites/           # Named suite definitions
└── interfaces/       # TypeScript interfaces for test data
scripts/
├── run.ts            # Custom test runner (filtering, suites, reporting)
├── process-report.ts # Report metadata injection
└── clean-reports.ts  # Report cleanup
```

---

## Running tests

```bash
npm install
npm test [-- flags]
```

### Flags

| Flag | Description |
|---|---|
| `--env <name>` | Target environment: `dev` (default), `qa`, `prod` |
| `--tag <value>` | Run tests matching a category tag or test case ID |
| `--keyword <text>` | Run tests whose full title contains the given text |
| `--suite <name>` | Run a named suite from `cypress/suites/suites.json` |
| `--list-suites` | Print all available suites and exit |
| `--clean` | Delete previous report artifacts before running |

### Examples

```bash
npm test                                  # all tests, dev environment
npm test -- --env qa                      # all tests, QA environment
npm test -- --tag @smoke                  # smoke tests only
npm test -- --tag TC-UI-002               # one specific test case
npm test -- --keyword "checkout"          # tests matching a keyword
npm test -- --suite regression --env prod # full regression on prod
npm test -- --clean --env qa --tag @smoke # clean run, smoke on QA
npm test -- --list-suites                 # show available suites
```

---

## Environments

Configs live in `cypress/config/`. Each file sets `baseUrl` and `apiUrl` for that environment.

Local overrides (e.g. credentials) go in `cypress/local.config.json` (gitignored). See `cypress.env.example.json` for the expected shape.

---

## Reporting

Each run generates an interactive HTML report via [Mochawesome](https://github.com/adamgruber/mochawesome), plus JUnit XML for CI integration.

**Pipeline:**

```
Cypress run  →  mocha JSON files  →  merge  →  process metadata  →  HTML report
```

Reports are written to `cypress/reports/html/index.html`. Screenshots of passing tests are captured automatically and embedded in the report.

---

## Tagging convention

Tests carry two kinds of tags:

| Format | Purpose | Examples |
|---|---|---|
| `@<name>` | Category — marks the type or scope of a test | `@smoke`, `@regression`, `@debugging` |
| `TC-<area>-<number>` | Test case ID — traces back to the test plan | `TC-UI-001`, `TC-API-002` |

```ts
it("should login with valid credentials", { tags: ["TC-UI-002", "@smoke"] }, () => { ... })
```

Both formats work with `--tag`. A test can carry one or both.

---

## Stack

| Tool | Purpose |
|---|---|
| [Cypress](https://www.cypress.io/) | Test runner |
| [TypeScript](https://www.typescriptlang.org/) | Language |
| [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep) | Tag and keyword filtering |
| [Faker.js](https://fakerjs.dev/) | Test data generation |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | HTML report |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | Linting and formatting |
