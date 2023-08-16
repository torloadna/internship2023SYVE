import { WebDriver, By } from "selenium-webdriver";
import testData from '../data/checkout-form-data.json'
import DriverSetup from "../config/driver-setup";
import urls from '../data/urls';

export default class CheckoutFormPage {

    private driver: WebDriver;

    private firstName = By.id('first-name');
    private lastName = By.id('last-name');
    private postalCode = By.id('postal-code');
    private continueButton = By.id('continue');
    private cancelButton = By.id('cancel');

    constructor() {
        this.driver = DriverSetup.getInstance().getDriver();
    }

    async fillOutForm(): Promise<void> {
        await this.driver.findElement(this.firstName).sendKeys(testData.checkoutFormData.firstName);
        await this.driver.findElement(this.lastName).sendKeys(testData.checkoutFormData.lastName);
        await this.driver.findElement(this.postalCode).sendKeys(testData.checkoutFormData.postalCode);
    }

    async clickContinueButton(): Promise<void> {
        await this.driver.findElement(this.continueButton).click();
    }

    async clickCancelButton(): Promise<void> {
        await this.driver.findElement(this.cancelButton).click();
    }

    async checkIsAtCheckoutFormPage(): Promise<void> {
        const currentURL = await this.driver.getCurrentUrl();
        expect(currentURL).toContain(urls.checkoutFormURL);
    }
}
