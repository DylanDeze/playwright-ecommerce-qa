import { expect, test } from "../../fixtures/test.fixtures";
import { parsePrice } from "../../utils/price.utils";

test.describe('Cart', () => {
    test('CART-001 - updates quantity and recalculates the cart total',
        { tag: '@smoke' }, async ({
            catalogPage,
            productPage,
            cartPage
        }) => {
        const productId = 8;
        const expectedQuantity = 3;

        await catalogPage.goto();
        const unitPriceProductText = await catalogPage.getProductPrice(productId).innerText();
        const unitPriceProduct = parsePrice(unitPriceProductText);
        await catalogPage.openProduct(productId);

        await productPage.addToCart();
        await productPage.gotoCart();

        await cartPage.increaseQuantity(productId, 2);

        await expect(cartPage.getProductQuantity(productId)).toHaveText(String(expectedQuantity));

        const expectedTotal = unitPriceProduct * expectedQuantity;
        const totalCart = parsePrice(await cartPage.totalPrice.innerText());
        await expect(totalCart).toBe(expectedTotal);
    });

    test('CART-002 - removes a product and recalculates the cart total', async ({
        catalogPage,
        productPage,
        cartPage
    }) => {
        const firstProductId = 5;
        const secondProductId = 6;

        await catalogPage.goto();
        const firstUnitPriceProductText = await catalogPage.getProductPrice(firstProductId).innerText();
        const secondUnitPriceProductText = await catalogPage.getProductPrice(secondProductId).innerText();
        const firstUnitPriceProduct = parsePrice(firstUnitPriceProductText);
        const secondUnitPriceProduct = parsePrice(secondUnitPriceProductText);
        await catalogPage.openProduct(firstProductId);
        await productPage.addToCart();
        await productPage.goBack();

        await catalogPage.openProduct(secondProductId);
        await productPage.addToCart();
        await productPage.gotoCart();

        const totalTwoProducts = firstUnitPriceProduct + secondUnitPriceProduct;
        const totalCart = parsePrice(await cartPage.totalPrice.innerText());
        expect(totalCart).toBe(totalTwoProducts);
        await cartPage.removeProduct(firstProductId);
        const totalCartAfterRemove = parsePrice(await cartPage.totalPrice.innerText());
        const totalExpected = totalTwoProducts - firstUnitPriceProduct;
        expect(totalCartAfterRemove).toBeCloseTo(totalExpected, 2);

    });

    test('CART-003 - displays empty cart state after removing the last product', async ({
        catalogPage,
        productPage,
        cartPage
    }) => {
        const productId = 11;

        await catalogPage.goto();
        await catalogPage.openProduct(productId);

        await productPage.addToCart();
        await productPage.gotoCart();

        await expect(cartPage.cartQuantity).toHaveText('1');
        await cartPage.removeProduct(productId);
        await expect(cartPage.emptyCartMessage).toBeVisible();

    })
})