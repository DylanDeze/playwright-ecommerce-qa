# E-commerce QA Automation Framework

A professional end-to-end test automation project built with **Playwright** and **TypeScript** against a real e-commerce web application.

The project demonstrates a maintainable QA automation approach focused on **business-critical user journeys**, **risk-based testing**, **reliable synchronization**, and **continuous integration with GitHub Actions**.

## Application Under Test

**Mission Playwright Shop**

https://shop.missionplaywright.fr/

The automated coverage focuses on the main e-commerce flows:

- Product catalog and product details
- Shopping cart
- Authentication
- Checkout
- Order creation
- Complete purchase journey

---

## Tech Stack

- **Playwright**
- **TypeScript**
- **Node.js**
- **GitHub Actions**
- **Faker**
- **Git / GitHub**

Tests are executed on **Chromium in CI**.

The Playwright configuration also supports Chromium, Firefox and WebKit for local cross-browser execution.

---

## Project Structure

```text
playwright-ecommerce-qa/
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── tests/
│   ├── cart/
│   ├── checkout/
│   ├── e2e/
│   ├── login/
│   └── products/
│
├── pages/
│   ├── components/
│   ├── CartPage.ts
│   ├── CatalogPage.ts
│   ├── CheckoutPage.ts
│   ├── LoginPage.ts
│   └── ProductPage.ts
│
├── data/
├── factories/
├── fixtures/
├── utils/
│
├── docs/
│   ├── TEST_PLAN.md
│   └── AUTOMATION_STRATEGY.md
│
├── playwright.config.ts
├── package.json
├── package-lock.json
├── .env.example
└── README.md
```

---

## Test Coverage

The suite focuses on a limited number of meaningful scenarios rather than maximizing test count.

| ID        | Scenario                                                 | Type                    |
| --------- | -------------------------------------------------------- | ----------------------- |
| PROD-001  | Product data consistency between catalog and detail page | Regression              |
| PROD-002  | Add a product to the cart                                | Smoke / Regression      |
| CART-001  | Update quantity and verify cart total                    | Smoke / Regression      |
| CART-002  | Remove a product and verify total recalculation          | Regression              |
| AUTH-001  | Login with valid credentials                             | Smoke / Regression      |
| AUTH-002  | Reject login with invalid password                       | Negative / Regression   |
| CHECK-001 | Verify cart-to-checkout consistency                      | Smoke / Regression      |
| CHECK-002 | Validate required shipping fields                        | Negative / Regression   |
| CHECK-003 | Prevent duplicate order submission                       | Robustness / Regression |
| E2E-001   | Complete a full purchase successfully                    | Smoke / E2E             |

---

## Architecture

The framework follows a **Page Object Model (POM)** approach.

Page objects contain reusable interactions with the application, while test files remain responsible for business assertions.

```text
Tests
  │
  ├── Fixtures
  │
  ├── Page Objects
  │
  ├── Test Data / Factories
  │
  └── Utilities
```

### Page Objects

Page objects encapsulate application interactions such as:

- Navigating between pages
- Adding products to the cart
- Updating quantities
- Filling shipping information
- Filling payment information
- Submitting orders

Assertions remain in the tests to keep business expectations explicit.

### Fixtures

Custom Playwright fixtures provide page objects and reusable authenticated sessions to tests.

This reduces setup duplication while keeping test scenarios readable.

### Test Data

Different strategies are used depending on the nature of the data:

- **Faker** for variable shipping/customer data
- **Deterministic data** for payment scenarios
- **Environment variables** for sensitive authentication credentials

---

## Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

Clone the repository:

```bash
git clone https://github.com/DylanDeze/playwright-ecommerce-qa
cd playwright-ecommerce-qa
```

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Environment Variables

Authentication credentials are not committed to the repository.

Create a `.env` file at the project root:

```env
TEST_USER_EMAIL=your-test-user-email
TEST_USER_PASSWORD=your-test-user-password
```

An `.env.example` file is included as a template.

> Never commit real credentials to the repository.

---

## Running the Tests

### Full regression suite

```bash
npx playwright test
```

### Smoke suite

```bash
npx playwright test --grep @smoke
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Playwright UI mode

```bash
npx playwright test --ui
```

---

## Smoke Testing Strategy

The `@smoke` tag identifies the most critical scenarios required to quickly validate the application.

The smoke suite covers:

- Adding a product to the cart
- Updating cart quantity
- Authentication
- Cart-to-checkout consistency
- Complete purchase journey

Run it with:

```bash
npx playwright test --grep @smoke
```

The same suite is automatically executed by GitHub Actions on Pull Requests targeting `main`.

---

## Continuous Integration

The project uses **GitHub Actions** to automatically validate changes.

### Pull Requests

For every Pull Request targeting `main`:

```text
Pull Request
     ↓
Install dependencies
     ↓
Install Chromium
     ↓
Run @smoke tests
     ↓
Upload Playwright report
```

This provides fast feedback before changes are merged.

### Main Branch

After a merge or push to `main`:

```text
Push to main
     ↓
Install dependencies
     ↓
Install Chromium
     ↓
Run full regression suite
     ↓
Upload Playwright report
```

CI execution is intentionally limited to **Chromium** to provide fast and deterministic feedback while keeping cross-browser execution available locally.

---

## Test Reports

Playwright automatically generates an HTML report.

To open the latest local report:

```bash
npx playwright show-report
```

In GitHub Actions, the Playwright HTML report is uploaded as a workflow artifact even when tests fail, making CI failures easier to investigate.

---

## Reliability Practices

The project avoids arbitrary sleeps such as:

```ts
page.waitForTimeout(...)
```

Instead, synchronization relies on Playwright's auto-waiting capabilities and application-specific signals.

Examples include:

- Web-first assertions
- URL assertions
- Element visibility
- Network response synchronization
- Waiting for application data before interacting with hydrated forms

For network-dependent actions, listeners are registered **before** the triggering action to avoid race conditions.

---

## Business-Oriented Assertions

The tests verify business behavior rather than only checking whether elements are visible.

Examples include:

- Product information remains consistent between pages
- Cart totals are recalculated after quantity changes
- Cart information remains consistent during checkout
- Required shipping information prevents progression
- Duplicate submissions do not create multiple orders
- A successful purchase creates an order and displays confirmation

---

## CI Secrets

Sensitive credentials are stored using **GitHub Actions Repository Secrets**:

```text
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

The workflow injects these values as environment variables during test execution.

No authentication credentials are stored in the source code.

---

## QA Approach

This project follows several principles:

**Quality over quantity**

The goal is not to automate every possible scenario, but to cover meaningful business risks with reliable tests.

**One test, one clear intent**

Each test focuses on a specific behavior or business rule.

**Readable tests**

Tests describe what is being verified while Page Objects describe how the application is manipulated.

**Deterministic execution**

Synchronization and test data are designed to reduce flaky behavior.

**Risk-based coverage**

Critical user journeys such as authentication, cart management, checkout and order creation receive the highest priority.

---

## Documentation

Additional QA documentation is available in the `docs` directory:

- `TEST_PLAN.md` — functional scope, risks, priorities and test coverage
- `AUTOMATION_STRATEGY.md` — automation architecture, technical decisions and CI strategy

---

## Future Improvements

Possible future improvements include:

- Extended cross-browser CI coverage
- Additional edge-case scenarios
- Accessibility testing
- API-level test coverage
- Visual regression testing
- Improved test reporting and trend analysis

These improvements would be introduced based on project risk and business value rather than test count alone.

---

## Author

**Dylan NGUESSAN**

QA Automation Engineer

Built as a portfolio project to demonstrate practical QA automation skills with Playwright, TypeScript and Continuous Integration practices.
