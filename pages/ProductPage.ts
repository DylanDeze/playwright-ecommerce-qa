import { Locator, Page } from "@playwright/test";

export class ProductPage {

    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly cartButton: Locator;
    readonly backButton: Locator;

    constructor(private readonly page: Page) {
        this.page = page;

        this.productName = page.getByRole('heading', { level: 1 });
        this.productPrice = page.locator('span.text-4xl.font-bold');
        this.addToCartButton = page.getByTestId('product-detail-add-to-cart');
        this.cartButton = page.getByTestId('cart-button');
        this.backButton = page.getByTestId('product-detail-back-link');
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    async gotoCart(): Promise<void> {
        await this.cartButton.click();
    }

    async goBack(): Promise<void> {
        await this.backButton.click();
    }
}