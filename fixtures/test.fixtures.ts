import { Page, test as base } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { Header } from '../pages/components/Header';

type Pages = {
    header: Header,
    catalogPage: CatalogPage,
    productPage: ProductPage,
    cartPage: CartPage,
    checkoutPage: CheckoutPage,
    loginPage: LoginPage,
    authenticatedPage: Page

};

export const test = base.extend<Pages>({
    header: async ({ page }, use) => {
        await use(new Header(page));
    },
    catalogPage: async ({ page }, use) => {
        await use(new CatalogPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    authenticatedPage: async ({ page, loginPage }, use) => {
        const email = process.env.TEST_USER_EMAIL;
        const password = process.env.TEST_USER_PASSWORD;

        if (!email || !password) {
            throw new Error('Missing test user credentials !');
        }

        await loginPage.goto();
        await loginPage.login(email, password);
        await page.waitForURL('/');
        await use(page);
    }
})

export { expect } from '@playwright/test';