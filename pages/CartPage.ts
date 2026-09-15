import { Locator, Page } from "@playwright/test";

export class CartPage {
    readonly productName: Locator;
    readonly summary: Locator;
    readonly cartQuantity: Locator;
    readonly totalPrice: Locator;
    readonly emptyCartMessage: Locator;

    constructor(private readonly page: Page) {
        this.page = page;

        this.productName = page.getByRole('heading', { level: 3 });
        this.summary = page.getByText('Récapitulatif', { exact: true }).locator('..');
        const totalRow = this.summary.getByText('Total', { exact: true }).locator('..');
        this.cartQuantity = page.getByTestId('cart-count');
        this.totalPrice = totalRow.locator('span.text-2xl.font-bold');
        this.emptyCartMessage = page.getByRole('heading', { level: 1, name: 'Votre panier est vide' });
    }

    async goto(): Promise<void> {
        await this.page.goto('/cart');
    }

    getIncreaseButton(productId: number): Locator {
        return this.page.getByTestId(`increase-quantity-${productId}`);
    }

    async increaseQuantity(productId: number, times: number): Promise<void> {
        const button = this.getIncreaseButton(productId);

        for (let i = 0; i < times; i++) {
            await button.click();
        }
    }

    getProductQuantity(productId: number): Locator {
        return this.page.getByTestId(`quantity-${productId}`);
    }

    parsePrice(price: string): number {
        return Number(price.replace('€', '').trim().replace(',', '.'));
    }

    removeProduct(productId: number): Promise<void> {
        return this.page.getByTestId(`remove-item-${productId}`).click();
    }

    gotoCheckout(): Promise<void> {
        return this.page.getByTestId('checkout-button').click();
    }

}