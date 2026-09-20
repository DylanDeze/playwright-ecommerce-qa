import { Locator, Page, Response } from "@playwright/test";

export class CheckoutPage {

    readonly summary: Locator;
    readonly checkoutButton: Locator;
    readonly inputName: Locator;
    readonly inputLastName: Locator;
    readonly inputEmail: Locator;
    readonly inputPhoneNumber: Locator;
    readonly inputAddress: Locator;
    readonly inputCity: Locator;
    readonly inputPostalCode: Locator;
    readonly inputCardNumber: Locator;
    readonly inputNameCard: Locator;
    readonly inputExpiryDate: Locator;
    readonly inputCvv: Locator;
    readonly submitButton: Locator;
    readonly confirmedOrder: Locator;

    constructor(private readonly page: Page) {
        this.page = page;

        this.summary = page.getByRole('heading', { level: 3, name: 'Récapitulatif' }).locator('..');
        this.checkoutButton = page.getByTestId('shipping-submit-button');
        this.inputName = page.getByTestId('shipping-firstname-input');
        this.inputLastName = page.getByTestId('shipping-lastname-input');
        this.inputEmail = page.getByTestId('shipping-email-input');
        this.inputPhoneNumber = page.getByTestId('shipping-phone-input');
        this.inputAddress = page.getByTestId('shipping-address-input');
        this.inputCity = page.getByTestId('shipping-city-input');
        this.inputPostalCode = page.getByTestId('shipping-postalcode-input');
        this.inputCardNumber = page.getByTestId('payment-cardnumber-input');
        this.inputNameCard = page.getByTestId('payment-cardname-input');
        this.inputExpiryDate = page.getByTestId('payment-expiry-input');
        this.inputCvv = page.getByTestId('payment-cvv-input');
        this.submitButton = page.getByTestId('payment-submit-button');
        this.confirmedOrder = page.getByRole('heading', { name: 'Commande confirmée' });

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

    async continueToPayment(): Promise<void> {
        return await this.checkoutButton.click();
    }

    async isRequiredValueMissing(field: Locator): Promise<boolean> {
        return field.evaluate(
            (input: HTMLInputElement) => input.validity.valueMissing
        );
    }

    waitForProfileResponse(): Promise<Response> {
        return this.page.waitForResponse(
            resp =>
                resp.url().includes('/profiles') &&
                resp.request().method() == 'GET' &&
                resp.ok()
        );
    }

    async fillShippingInformation(shippingData: {
        name: string,
        lastName: string,
        email: string,
        phone: string,
        address: string,
        city: string,
        postalCode: string
    }
    ): Promise<void> {
        await this.inputName.fill(shippingData.name);
        await this.inputLastName.fill(shippingData.lastName);
        await this.inputEmail.fill(shippingData.email);
        await this.inputPhoneNumber.fill(shippingData.phone);
        await this.inputAddress.fill(shippingData.address);
        await this.inputCity.fill(shippingData.city);
        await this.inputPostalCode.fill(shippingData.postalCode);
    }

    async clearInputInformations(): Promise<void> {
        await this.inputName.clear();
        await this.inputLastName.clear();
        await this.inputEmail.clear();
        await this.inputPhoneNumber.clear();
        await this.inputAddress.clear();
        await this.inputCity.clear();
        await this.inputPostalCode.clear();
    }

    async fillPaymentInformation(validPaymentData: {
        cardNumber: string,
        nameCard: string,
        expiryDate: string,
        cvv: string
    }
    ): Promise<void> {
        await this.inputCardNumber.fill(validPaymentData.cardNumber);
        await this.inputNameCard.fill(validPaymentData.nameCard);
        await this.inputExpiryDate.fill(validPaymentData.expiryDate);
        await this.inputCvv.fill(validPaymentData.cvv);
    }

    async doubleClickPayment(): Promise<void> {
        await this.submitButton.dblclick();
    }

    async submitPayment(): Promise<void> {
        await this.submitButton.click();
    }
}