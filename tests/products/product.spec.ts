import { expect, test } from "../../fixtures/test.fixtures";

test.describe('Product', () => {

    test('PROD-001 - product data is consistent', async ({
        catalogPage,
        productPage,
        page
    }) => {
        const productId = 3;

        await catalogPage.goto();

        const catalogName = await catalogPage.getProductName(productId).innerText();
        const catalogPrice = await catalogPage.getProductPrice(productId).innerText();

        await catalogPage.openProduct(productId);
        await expect(page).toHaveURL(
            new RegExp(`product/${productId}$`)
        );

        await expect(productPage.productName).toHaveText(catalogName);
        await expect(productPage.productPrice).toHaveText(catalogPrice);

    });

    test('PROD-002 - should add a product to the cart',
        { tag: '@smoke' }, async ({
            catalogPage,
            productPage,
            cartPage
        }) => {
        const productId = 3;

        await catalogPage.goto();
        await catalogPage.openProduct(productId);

        const productName = await productPage.productName.innerText();
        const productPrice = await productPage.productPrice.innerText();

        await productPage.addToCart();
        await productPage.gotoCart();

        await expect(cartPage.productName).toHaveText(productName);
        await expect(cartPage.totalPrice).toHaveText(productPrice);
        await expect(cartPage.cartQuantity).toHaveText('1');
    });
})