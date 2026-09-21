# Test Plan

## 1. Purpose

This document defines the functional testing approach for the e-commerce application automated in this project.

The objective is to validate the application's most important business flows using a risk-based approach rather than attempting to automate every possible scenario.

The automated test suite focuses primarily on:

- Product browsing
- Shopping cart management
- Authentication
- Checkout
- Order creation
- End-to-end purchase flow

---

## 2. Application Under Test

**Application:** Mission Playwright Shop

**URL:** https://shop.missionplaywright.fr/

**Application type:** E-commerce web application

The application allows users to browse products, manage a shopping cart, authenticate, enter shipping and payment information, and complete an order.

---

## 3. Test Objectives

The main objectives of the test suite are to verify that:

- Product information remains consistent across the customer journey
- Products can be added to the cart
- Cart quantities and totals are correctly recalculated
- Products can be removed from the cart
- Users can authenticate with valid credentials
- Invalid authentication attempts are rejected
- Cart information remains consistent during checkout
- Required checkout information is properly validated
- Duplicate order submissions are prevented
- A complete purchase flow can be successfully completed

---

## 4. Scope

### In Scope

The automated test scope includes:

- Product catalog
- Product detail page
- Shopping cart
- Authentication
- Shipping information
- Checkout
- Payment form completion
- Order submission
- Order confirmation
- Critical end-to-end purchase journey

### Out of Scope

The following areas are currently outside the automated scope:

- Real payment processing
- Performance and load testing
- Accessibility testing
- Visual regression testing
- Mobile-specific testing
- Extensive cross-browser validation in CI
- Backend API testing as an independent test layer
- Security testing

These areas could be introduced later depending on business risk and project requirements.

---

## 5. Test Cases

| ID        | Test Scenario                                                      | Priority | Test Type                          |
| --------- | ------------------------------------------------------------------ | -------- | ---------------------------------- |
| PROD-001  | Verify product data consistency between catalog and product detail | Critical | Regression                         |
| PROD-002  | Add a product to the cart                                          | Critical | Smoke / Regression                 |
| CART-001  | Update product quantity and verify cart total recalculation        | Critical | Smoke / Regression / Business Rule |
| CART-002  | Remove a product and verify total recalculation                    | Critical | Regression                         |
| AUTH-001  | Login with valid credentials                                       | Critical | Smoke / Regression                 |
| AUTH-002  | Reject login with an invalid password                              | High     | Negative / Regression              |
| CHECK-001 | Verify cart-to-checkout consistency                                | Critical | Smoke / Regression / Business Rule |
| CHECK-002 | Validate required shipping fields                                  | High     | Negative / Regression              |
| CHECK-003 | Prevent duplicate order submission                                 | Critical | Robustness / Regression            |
| E2E-001   | Complete a full purchase successfully                              | Critical | Smoke / E2E                        |

---

## 6. Risk-Based Testing Approach

The suite prioritizes scenarios according to their impact on the main customer journey.

### Critical Risks

The highest priority is given to failures that could prevent or corrupt a purchase.

Examples include:

- Product cannot be added to the cart
- Cart total is incorrect
- Authentication prevents access to checkout
- Cart data changes unexpectedly during checkout
- Multiple orders are created from a duplicate submission
- An order cannot be successfully completed

These risks are covered by Critical tests and, where appropriate, included in the smoke suite.

### High Risks

High-priority tests cover important validation behavior that may not completely block the application but could negatively affect the purchase process.

Example:

- Required shipping information is not correctly validated
- Invalid authentication credentials are accepted

---

## 7. Smoke Test Suite

The smoke suite provides fast validation of the most important application flows.

Tests included in the smoke suite:

| Test      | Purpose                                         |
| --------- | ----------------------------------------------- |
| PROD-002  | Verify that a product can enter the cart        |
| CART-001  | Verify cart quantity and total calculation      |
| AUTH-001  | Verify successful authentication                |
| CHECK-001 | Verify consistency between cart and checkout    |
| E2E-001   | Verify that the complete purchase journey works |

Smoke tests are identified using:

```text
@smoke
```

They can be executed locally with:

```bash
npx playwright test --grep @smoke
```

The same smoke suite is automatically executed in CI for Pull Requests targeting `main`.

---

## 8. Regression Strategy

The regression suite contains the complete automated functional test suite.

It is designed to detect regressions across:

- Products
- Cart
- Authentication
- Checkout
- Order creation
- End-to-end purchasing

The complete regression suite can be executed with:

```bash
npx playwright test
```

In CI, the full regression suite is automatically executed on Chromium after a push or merge to the `main` branch.

---

## 9. Test Data Strategy

Test data is selected according to the behavior being tested.

### Authentication Data

Authentication credentials are stored outside the source code using environment variables:

```text
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

Local credentials are stored in `.env`.

CI credentials are stored using GitHub Actions Repository Secrets.

### Shipping Data

Shipping information can vary between executions and is generated using Faker.

Examples include:

- Phone number
- Address
- City
- Postal code

This keeps the test data realistic while avoiding unnecessary hardcoded customer information.

### Payment Data

Payment test data is deterministic.

Payment fields are used only to exercise the application's test purchase workflow. No real payment credentials are stored in the repository.

---

## 10. Test Independence

Tests should remain as independent as reasonably possible.

Each test is responsible for preparing the state required for its own scenario.

Tests must not depend on the execution order of other tests.

Shared setup should only be introduced when it improves maintainability without hiding the purpose of the scenario.

---

## 11. Validation Strategy

Assertions focus on observable business behavior.

Examples include:

- Product names and prices remain consistent
- Product quantity changes correctly
- Cart totals reflect quantity changes
- Checkout contains the expected product information
- Invalid login remains rejected
- Required fields prevent progression
- A duplicate submission creates only one order
- A successful purchase results in an order confirmation

The suite avoids relying solely on URL changes when the URL does not uniquely represent the application state.

---

## 12. Entry Criteria

Automated testing can begin when:

- The application is accessible
- Required test credentials are available
- Dependencies are installed
- Playwright browsers are installed
- Required environment variables are configured

For CI execution, the required GitHub Repository Secrets must also be configured.

---

## 13. Exit Criteria

A test execution is considered successful when:

- All selected tests complete
- All Critical assertions pass
- No unexpected functional regression is detected
- CI completes successfully for the expected test scope

For Pull Requests, the smoke suite must pass before merge.

After changes reach `main`, the complete regression suite is expected to pass.

---

## 14. Failure Investigation

When an automated test fails, investigation should determine whether the cause is:

1. A product defect
2. A test automation defect
3. A synchronization issue
4. A test-data issue
5. An environment or infrastructure issue

Playwright reports and traces can be used to investigate failures.

CI also publishes the Playwright HTML report as a workflow artifact.

---

## 15. Maintenance

The test suite should evolve with application risks and business behavior.

New tests should be introduced when they provide meaningful coverage of a new risk or requirement.

The objective is not to maximize the number of automated tests.

The objective is to maintain a small, reliable and valuable regression suite.
