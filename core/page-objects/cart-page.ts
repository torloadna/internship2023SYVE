import { By } from "selenium-webdriver";
import DriverSetup from "../config/driver-setup";
import urls from '../data/urls';
import Base from "./base-page";

export default class CartPage extends Base {



    private title = By.xpath('//div[@class="header_secondary_container"]/span');
    private checkoutButton = By.id('checkout');
    private cartList = By.className('cart_list');
    private continueShopping = By.id('continue-shopping');
    private cartItems = By.className('cart_item');


    constructor() {
        super();
        this.driver = DriverSetup.getInstance().getDriver();
    }

    async clickCheckoutButton(): Promise<void> {
        await this.driver.findElement(this.checkoutButton).click();
    }

    async getTextCartList(): Promise<string> {
        const cartListText: string = await this.driver.findElement(this.cartList).getText();
        return cartListText;
    }

    async validateCartList(checker: string): Promise<void> {
        expect(await this.getTextCartList()).toContain(checker);
    }

    async validateEmptyCartList(): Promise<void> {
        expect(await this.getTextCartList()).toEqual('QTYDescription');
    }

    async clickContinueShoppingButton(): Promise<void> {
        await this.driver.findElement(this.continueShopping).click();
    }

    async checkIsAtCartPage(): Promise<void> {
        const currentURL = await this.driver.getCurrentUrl();
        expect(currentURL).toContain(urls.cartURL);
    }

    async validateCartItems(checker: number): Promise<void> {
        expect((await this.driver.findElements(this.cartItems)).length).toEqual(checker);
    }

    async getTitleCartPage(): Promise<string> {
        const title: string = await this.driver.findElement(this.title).getText();
        return title;
    }

    async validateCartPageIsPresent(): Promise<void> {
        expect(await this.getTitleCartPage()).toEqual('Your Cart');
    }
}
