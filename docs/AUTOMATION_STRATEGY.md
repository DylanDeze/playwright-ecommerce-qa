# Automation Strategy

## 1. Purpose

This document describes the technical automation strategy used for the e-commerce QA project.

The framework is designed around three main objectives:

- Reliability
- Readability
- Maintainability

Automation decisions are driven by business risk and practical value rather than framework complexity.

---

## 2. Technology Stack

The automation framework uses:

- Playwright
- TypeScript
- Node.js
- Faker
- GitHub Actions
- Git / GitHub

Playwright was selected because it provides modern browser automation capabilities including:

- Auto-waiting
- Web-first assertions
- Network monitoring
- Browser contexts
- Tracing
- HTML reporting
- Multi-browser support

---

## 3. Framework Architecture

The project separates test responsibilities into several layers.

```text
Tests
  │
  ├── Page Objects
  │
  ├── Fixtures
  │
  ├── Factories / Test Data
  │
  └── Utilities
```

A simplified project structure is:

```text
tests/
├── products/
├── cart/
├── login/
├── checkout/
└── e2e/

pages/
├── components/
├── CatalogPage.ts
├── ProductPage.ts
├── CartPage.ts
├── CheckoutPage.ts
└── LoginPage.ts

fixtures/
factories/
data/
utils/
```

Each layer has a specific responsibility.

---

## 4. Page Object Model

The framework uses the Page Object Model to encapsulate reusable application interactions.

Examples include:

- Opening a product
- Adding a product to the cart
- Increasing a quantity
- Navigating to checkout
- Filling shipping information
- Filling payment information
- Submitting an order

The main design rule is:

> Page Objects describe how to interact with the application. Tests describe what should be verified.

Business assertions therefore remain in test files instead of being hidden inside Page Objects.

This keeps test intent visible and makes failures easier to understand.

---

## 5. Reusable Components

Application elements shared across multiple pages can be represented as reusable components.

For example, the global application header is represented separately from page-specific Page Objects.

This prevents duplication without creating unnecessary abstraction.

---

## 6. Fixtures

Custom Playwright fixtures are used to inject Page Objects into tests.

This allows tests to receive dependencies such as:

```ts
catalogPage;
productPage;
cartPage;
checkoutPage;
loginPage;
header;
```

An authenticated fixture is also used for scenarios that require an already authenticated user.

Authentication credentials are read from environment variables rather than hardcoded into tests.

Fixtures are kept focused on reusable setup and dependency creation.

Large business workflows are intentionally not hidden inside fixtures because doing so would make test behavior harder to understand.

---

## 7. Locator Strategy

Locators are selected according to stability and user-facing meaning.

The preferred strategy is:

1. Semantic and accessible locators when stable
2. `data-testid` attributes
3. Stable CSS selectors when necessary
4. XPath only as a last resort

Examples of preferred Playwright locators include:

```ts
page.getByRole(...)
page.getByText(...)
page.getByTestId(...)
```

Selectors tied heavily to visual implementation details are avoided when a more stable alternative exists.

---

## 8. Assertion Strategy

The framework uses Playwright web-first assertions whenever the expected value belongs to the browser UI.

Examples:

```ts
await expect(locator).toBeVisible();
await expect(locator).toHaveText(expectedText);
await expect(page).toHaveURL(expectedUrl);
```

Web-first assertions automatically retry until the expected condition is met or the assertion times out.

For values already extracted from the browser, standard synchronous assertions are used.

Example:

```ts
expect(total).toBeCloseTo(expectedTotal, 2);
```

This distinction keeps assertions aligned with Playwright's synchronization model.

---

## 9. Synchronization Strategy

Arbitrary sleeps are avoided.

The framework does not rely on:

```ts
page.waitForTimeout(...)
```

as a synchronization strategy.

Instead, synchronization is based on meaningful application state.

Examples include:

- Element visibility
- URL changes
- Playwright auto-waiting
- Web-first assertions
- Network responses

This reduces unnecessary waiting and helps prevent flaky tests.

---

## 10. Network Synchronization

Some workflows depend on asynchronous backend operations.

For these cases, Playwright network events are used to synchronize tests with meaningful application behavior.

A response listener or promise is registered before the action that triggers the request.

Conceptually:

```ts
const responsePromise = page.waitForResponse(...);

await triggeringAction();

const response = await responsePromise;
```

Registering the wait before the triggering action prevents race conditions where the response could occur before Playwright starts waiting for it.

---

## 11. Checkout Hydration

The checkout page loads profile information asynchronously.

This can create a race condition if a test starts modifying shipping fields before profile data has finished loading.

The automation therefore waits for the relevant profile response before manipulating those fields.

This is particularly important for required-field validation tests, where profile information may otherwise repopulate fields after they have been cleared.

The synchronization strategy follows the application's actual behavior instead of introducing arbitrary delays.

---

## 12. Required Field Validation

The application relies on native browser validation for some required shipping fields.

The tests do not assert localized browser validation messages because these messages may vary according to browser and operating-system language.

Instead, the tests inspect the underlying HTML validation state, such as:

```ts
input.validity.valueMissing;
```

This validates the business rule without coupling the test to a browser-specific message.

---

## 13. Test Data Strategy

Different types of test data are handled differently.

### Dynamic Data

Faker is used when realistic variation is useful.

For example:

- Phone numbers
- Addresses
- Cities
- Postal codes

Shipping data is generated through a dedicated factory.

### Deterministic Data

Data that represents a fixed business condition remains deterministic.

Payment test data is an example of this approach.

Randomizing data without a functional reason is avoided because unnecessary randomness can make failures harder to reproduce.

---

## 14. Utility Functions

Generic transformations that do not belong to a Page Object are implemented as utility functions.

For example, displayed prices can be converted from strings into numeric values before performing business calculations.

This allows tests to express calculations clearly without duplicating formatting logic.

---

## 15. Test Isolation

Tests should not rely on another test having executed first.

Each scenario prepares the application state it requires.

This improves:

- Reproducibility
- Debugging
- Parallel execution capability
- CI reliability

Test execution order should not determine whether a scenario passes or fails.

---

## 16. Smoke Strategy

Only tests representing critical application capabilities receive the `@smoke` tag.

The smoke suite currently covers:

- Product addition to cart
- Cart quantity and calculation
- Valid authentication
- Cart-to-checkout consistency
- Complete purchase flow

It can be executed with:

```bash
npx playwright test --grep @smoke
```

The complete suite does not require an `@regression` tag.

Running all tests naturally represents the regression suite:

```bash
npx playwright test
```

This avoids unnecessary tagging complexity.

---

## 17. Continuous Integration Strategy

GitHub Actions is used for Continuous Integration.

The CI strategy separates fast Pull Request feedback from complete regression validation.

### Pull Requests

Pull Requests targeting `main` execute the smoke suite on Chromium.

```text
Pull Request
     ↓
npm ci
     ↓
Install Chromium
     ↓
Run @smoke
     ↓
Upload Playwright report
```

### Main Branch

Pushes and merges to `main` execute the complete regression suite on Chromium.

```text
Push to main
     ↓
npm ci
     ↓
Install Chromium
     ↓
Run full regression
     ↓
Upload Playwright report
```

This provides fast validation before merge while ensuring that the complete suite is executed after changes reach the main branch.

---

## 18. Browser Strategy

The Playwright configuration supports:

- Chromium
- Firefox
- WebKit

CI currently executes Chromium only.

This is intentional.

Running one browser in CI keeps feedback reasonably fast while maintaining the possibility of executing cross-browser tests locally when required.

The CI browser scope can be expanded in the future if cross-browser risk justifies the additional execution cost.

---

## 19. Secrets Management

Sensitive authentication information is never hardcoded into tests.

Local execution uses environment variables loaded from `.env`.

The repository provides `.env.example` to document the required variables without exposing credentials.

Required variables:

```text
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

In GitHub Actions, the corresponding values are stored as Repository Secrets and injected into the test process.

---

## 20. Failure Diagnostics

Playwright provides several mechanisms for failure investigation.

The project uses Playwright reporting and CI artifacts to make failures easier to diagnose.

The HTML report can be opened locally using:

```bash
npx playwright show-report
```

GitHub Actions uploads the Playwright report after execution, including when tests fail unless the workflow is cancelled.

Traces can provide additional context when investigating failures.

---

## 21. Git Workflow

Development follows a feature-branch workflow.

The general process is:

```text
Feature branch
      ↓
Local implementation
      ↓
Local test execution
      ↓
Commit and push
      ↓
Pull Request
      ↓
Smoke CI
      ↓
Merge to main
      ↓
Full regression CI
```

This keeps `main` stable while providing automated validation before and after integration.

---

## 22. Maintainability Principles

The framework follows several principles.

### Prefer clarity over abstraction

Code is extracted only when reuse or maintainability justifies it.

Similar-looking code is not automatically abstracted when it represents different business intentions.

### Keep assertions visible

Business expectations remain in tests.

### Avoid unnecessary randomness

Random test data is introduced only when variation provides value.

### Synchronize with real application behavior

Network responses, UI state and Playwright auto-waiting are preferred over fixed delays.

### Keep tests focused

Each test should have one clear functional purpose.

### Automate meaningful risks

Test count is not treated as a quality metric.

---

## 23. Future Evolution

Potential future improvements include:

- Extended cross-browser execution in CI
- API test coverage
- Accessibility testing
- Visual regression testing
- Additional edge-case coverage
- Enhanced reporting
- Test execution trend monitoring

New framework complexity should only be introduced when justified by an actual testing need.

---

## 24. Guiding Principle

> Automate meaningful business risks with the simplest reliable solution.
