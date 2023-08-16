import { WebDriver, By } from "selenium-webdriver";
import DriverSetup from "../config/driver-setup";
import urls from '../data/urls';

export default class CheckoutCompletePage {

    private driver: WebDriver;

    private backHome = By.id('back-to-products');
    private finishText = By.xpath('//*[@id="checkout_complete_container"]/h2');

    constructor() {
        this.driver = DriverSetup.getInstance().getDriver();
    }

    async clickBackHomeButton(): Promise<void> {
        await this.driver.findElement(this.backHome).click();
    }

    async getFinishText(): Promise<string> {
        const finishOrderText: string = await this.driver.findElement(this.finishText).getText();
        return finishOrderText;
    }

    async validateCheckoutCompleted(checker: string): Promise<void> {
        expect(await this.getFinishText()).toMatch(checker);
    }

    async checkIsAtCheckoutComplete(): Promise<void> {
        const currentURL = await this.driver.getCurrentUrl();
        expect(currentURL).toContain(urls.checkoutCompleteURL);
    }
}
