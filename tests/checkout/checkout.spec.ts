import { validPaymentData } from "../../data/payment.data";
import { createShippingData } from "../../factories/shipping.factories";
import { expect, test } from "../../fixtures/test.fixtures";
import { parsePrice } from "../../utils/price.utils";

test.describe('Checkout', () => {
    test('CHECK-001 - Cart-to-checkout consistency',
        { tag: '@smoke' }, async ({
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

    test('CHECK-002 - should validate required checkout fields',
        { tag: '@negative' }, async ({
            authenticatedPage,
            catalogPage,
            productPage,
            cartPage,
            checkoutPage,
            page
        }) => {
        const productId = 7;

        await catalogPage.goto();
        await catalogPage.openProduct(productId);
        await productPage.addToCart();
        await productPage.gotoCart();
        const profileResponse = checkoutPage.waitForProfileResponse();
        await cartPage.gotoCheckout();
        await profileResponse;
        await checkoutPage.clearInputInformations();
        await checkoutPage.continueToPayment();

        await expect(page).toHaveURL('/checkout');
        expect(await checkoutPage.isRequiredValueMissing(checkoutPage.inputName)).toBe(true);
        expect(await checkoutPage.isRequiredValueMissing(checkoutPage.inputLastName)).toBe(true);
        expect(await checkoutPage.isRequiredValueMissing(checkoutPage.inputEmail)).toBe(true);
        expect(await checkoutPage.isRequiredValueMissing(checkoutPage.inputPhoneNumber)).toBe(true);
        expect(await checkoutPage.isRequiredValueMissing(checkoutPage.inputAddress)).toBe(true);
        expect(await checkoutPage.isRequiredValueMissing(checkoutPage.inputCity)).toBe(true);
        expect(await checkoutPage.isRequiredValueMissing(checkoutPage.inputPostalCode)).toBe(true);
    });

    test('CHECK-003 - should prevent duplicate order submission',
        { tag: '@robustness' }, async ({
            authenticatedPage,
            catalogPage,
            productPage,
            cartPage,
            checkoutPage,
            page
        }) => {
        const productId = 9;

        await catalogPage.goto();
        await catalogPage.openProduct(productId);
        await productPage.addToCart();
        await productPage.gotoCart();
        const profileResponse = checkoutPage.waitForProfileResponse();
        await cartPage.gotoCheckout();
        await profileResponse;
        const shippingData = createShippingData();
        await checkoutPage.fillShippingInformation(shippingData);
        await checkoutPage.continueToPayment();
        await checkoutPage.fillPaymentInformation(validPaymentData);

        let orderCreationCount = 0;
        page.on('response', response => {
            if (
                response.url().includes('/orders') &&
                response.request().method() == 'POST' &&
                response.status() == 201
            ) {
                orderCreationCount++;
            }
        });

        await checkoutPage.doubleClickPayment();
        await expect(checkoutPage.confirmedOrder).toBeVisible();
        await expect(orderCreationCount).toBe(1);

    });
})