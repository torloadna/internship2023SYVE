import { WebDriver, By } from "selenium-webdriver";
import DriverSetup from "../config/driver-setup";
import urls from '../data/urls';

export default class CheckoutOverviewPage {

    private driver: WebDriver;

    private finishButton = By.id('finish');
    private checkoutTitle = By.xpath('//div[@class="header_secondary_container"]/span');
    private cancelButton = By.id('cancel');
    private shippingInformation = By.xpath('//*[@id="checkout_summary_container"]/div/div[2]/div[4]');
    private itemTotalPrice = By.xpath('//*[@id="checkout_summary_container"]/div/div[2]/div[6]');
    private priceWithTax = By.xpath('//*[@id="checkout_summary_container"]/div/div[2]/div[8]');

    constructor() {
        this.driver = DriverSetup.getInstance().getDriver();
    }

    async clickFinishButton(): Promise<void> {
        await this.driver.findElement(this.finishButton).click();
    }

    async getCheckoutTitle(): Promise<string> {
        const checkoutOverviewTitle: string = await this.driver.findElement(this.checkoutTitle).getText();
        return checkoutOverviewTitle;
    }

    async validateCheckoutOverviewPageTitle(checker: string): Promise<void> {
        expect(await this.getCheckoutTitle()).toContain(checker);
    }

    async clickCancelButton(): Promise<void> {
        await this.driver.findElement(this.cancelButton).click();
    }

    async checkIsAtCheckoutOverview(): Promise<void> {
        const currentURL = await this.driver.getCurrentUrl();
        expect(currentURL).toContain(urls.checkoutOverviewURL);
    }

    async getTextPaymentInformation(): Promise<string> {
        const paymentInformationText: string = await this.driver.findElement(this.shippingInformation).getText();
        return paymentInformationText;
    }

    async getTextTotalPrice(): Promise<string> {
        const itemTotalPriceText: string = await this.driver.findElement(this.itemTotalPrice).getText();
        return itemTotalPriceText;
    }

    async getTextPriceWithTax(): Promise<string> {
        const priceWithTaxText: string = await this.driver.findElement(this.priceWithTax).getText();
        return priceWithTaxText;
    }

    async validatePaymentInformation(): Promise<void> {
        expect(await this.getTextPaymentInformation()).toEqual("Free Pony Express Delivery!");
        expect(await this.getTextTotalPrice()).toContain("129.94");
        expect(await this.getTextPriceWithTax()).toContain("140.34");
    }

}
