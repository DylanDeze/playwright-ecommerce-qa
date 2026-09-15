import { Locator, Page } from "@playwright/test";

export class CatalogPage {

    readonly productCards: Locator;

    constructor(private readonly page: Page) {
        this.page = page;

        this.productCards = page.locator('[data-testid^="product-card-"]');
    }

    async goto(): Promise<void> {
        await this.page.goto('/products');
    }

    getProductById(id: number): Locator {
        return this.page.getByTestId(`product-card-${id}`);
    }

    getProductContainerId(id: number): Locator {
        return this.page.getByTestId(`product-container-${id}`);
    }

    getProductName(id: number): Locator {
        return this.getProductContainerId(id).getByRole('heading', { level: 3 });
    }

    getProductPrice(id: number): Locator {
        return this.getProductContainerId(id).locator('span.text-lg.font-bold.text-foreground');
    }

    async openProduct(id: number): Promise<void> {
        await this.getProductById(id).click();
    }

}