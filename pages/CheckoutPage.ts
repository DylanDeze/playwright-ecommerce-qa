import { Locator, Page } from "@playwright/test";

export class CheckoutPage {
    readonly summary: Locator;
    constructor(private readonly page: Page) {
        this.page = page;

        this.summary = page.getByRole('heading', { level: 3, name: 'Récapitulatif' }).locator('..');
    }

    getProductRow(): Locator {
        return this.summary.locator('.flex.gap-3');
    }

    getProductName(): Locator {
        return this.getProductRow().locator('.flex-1 p').first();
    }

    getProductQuantity(): Locator {
        return this.getProductRow().getByText(/^Qté:\s*\d+$/);
    }

    getProductPrice(): Locator {
        return this.getProductRow().locator(':scope > p');
    }
}