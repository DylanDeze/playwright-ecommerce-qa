import { expect, test } from "../../fixtures/test.fixtures";
import { parsePrice } from "../../utils/price.utils";

test.describe('Checkout', () => {
    test('CHECK-001 - Cart-to-checkout consistency', async ({
        authenticatedPage,
        catalogPage,
        productPage,
        cartPage,
        checkoutPage,
        page
    }) => {
        const productId = 11;
        const expectedQuantity = 2;

        await catalogPage.goto();
        const expectedProductName = await catalogPage.getProductName(productId).innerText();
        const priceProductText = await catalogPage.getProductPrice(productId).innerText();
        const priceProduct = parsePrice(priceProductText);
        const expectedPriceProduct = priceProduct * expectedQuantity;

        await catalogPage.openProduct(productId);
        await productPage.addToCart();
        await productPage.gotoCart();
        await cartPage.increaseQuantity(productId, 1);
        const expectedProductQuantity = await cartPage.getProductQuantity(productId).innerText();
        await cartPage.gotoCheckout();
        await expect(page).toHaveURL('/checkout');
        await expect(checkoutPage.getProductName()).toHaveText(expectedProductName);

        const checkoutPriceText = await checkoutPage.getProductPrice().innerText();
        const checkoutPrice = parsePrice(checkoutPriceText);
        expect(checkoutPrice).toBeCloseTo(expectedPriceProduct, 2);
        await expect(checkoutPage.getProductQuantity()).toHaveText(`Qté: ${expectedProductQuantity}`);


    });
})