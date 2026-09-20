import { validPaymentData } from "../../data/payment.data";
import { createShippingData } from "../../factories/shipping.factories";
import { expect, test } from "../../fixtures/test.fixtures";

test('E2E-001 - should complete a full purchase successfully',
    { tag: ['@smoke', '@e2e'] }, async ({
        authenticatedPage,
        catalogPage,
        productPage,
        cartPage,
        checkoutPage,
        page
    }) => {
    const productId = 5;

    await catalogPage.goto();
    await catalogPage.openProduct(productId);
    await productPage.addToCart();
    await productPage.gotoCart();
    const profileResponse = checkoutPage.waitForProfileResponse();
    await cartPage.gotoCheckout();
    await profileResponse;
    await checkoutPage.clearInputInformations();
    const shippingData = createShippingData();
    await checkoutPage.fillShippingInformation(shippingData);
    await checkoutPage.continueToPayment();
    await checkoutPage.fillPaymentInformation(validPaymentData);
    const orderResponsePromise = page.waitForResponse(
        response =>
            response.url().includes('/orders') &&
            response.request().method() == 'POST'
    );
    await checkoutPage.submitPayment();
    const orderResponse = await orderResponsePromise;

    expect(orderResponse.status()).toBe(201);
    await expect(checkoutPage.confirmedOrder).toBeVisible();
});