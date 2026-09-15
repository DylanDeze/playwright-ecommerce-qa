import { expect, test } from "../../fixtures/test.fixtures";

test.describe('AUTHENTIFICATION', () => {
    test('AUTH-001 - valid login', async ({
        header,
        loginPage,
        page
    }) => {
        await loginPage.goto();
        await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
        await expect(page).toHaveURL('/');
        await header.openAccountMenu();
        await expect(header.logoutButton).toBeVisible();
    });
})