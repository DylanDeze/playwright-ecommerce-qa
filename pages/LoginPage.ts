import { Locator, Page } from "@playwright/test";

export class LoginPage {

    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly submitButton: Locator;

    constructor(private readonly page: Page) {
        this.page = page;

        this.loginEmailInput = page.getByTestId('login-email-input');
        this.loginPasswordInput = page.getByTestId('login-password-input');
        this.submitButton = page.getByTestId('login-submit-button');
    }

    async goto(): Promise<void> {
        await this.page.goto('/auth');
    }

    async login(username: string, password: string): Promise<void> {
        await this.loginEmailInput.fill(username);
        await this.loginPasswordInput.fill(password);
        await this.submitButton.click();
    }
}