import { Locator, Page } from "@playwright/test";

export class Header {

    readonly accountMenu: Locator;
    readonly logoutButton: Locator;

    constructor(private readonly page: Page) {
        this.accountMenu = this.page.getByTestId('user-menu-button');
        this.logoutButton = this.page.getByTestId('logout-button');
    }

    async openAccountMenu(): Promise<void> {
        await this.accountMenu.click();
    }
}