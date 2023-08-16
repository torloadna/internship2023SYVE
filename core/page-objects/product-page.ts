import { By, until } from "selenium-webdriver";
import DriverSetup from "../config/driver-setup";
import urls from '../data/urls';
import Base from "./base-page";

export default class ProductPage extends Base {

    private productDetails = By.className('inventory_details_container');
    private removeButton = By.id("remove-sauce-labs-backpack");
    private sauceLabsBackpack = By.id('item_4_title_link');
    private addToCart = By.id('add-to-cart-sauce-labs-backpack');
    protected cartIcon = By.id('shopping_cart_container');
    private itemTitles = By.className('inventory_item_name');
    private removeSauceLabsBackpack = By.id("remove-sauce-labs-backpack");

    constructor() {
        super();
        this.driver = DriverSetup.getInstance().getDriver();
    }

    async getInventoryDetails(): Promise<string> {
        const details: string = await this.driver.findElement(this.productDetails).getText();
        return details;
    }

    async validateProductTitle(checker: string): Promise<void> {
        expect(await this.getInventoryDetails()).toContain(checker);
    }

    async getTextRemoveButton(): Promise<string> {
        const buttonText: string = await this.driver.findElement(this.removeButton).getText();
        return buttonText;
    }

    async clickRemoveButton(): Promise<void> {
        await this.driver.findElement(this.removeSauceLabsBackpack).click();
    }

    async validateRemoveButton(checker: string): Promise<void> {
        expect(await this.getTextRemoveButton()).toMatch(checker);
    }

    async clickOnSauceBackpack(): Promise<void> {
        await this.driver.findElement(this.sauceLabsBackpack).click();
    }

    async clickAddToCartButton(): Promise<void> {
        await this.driver.findElement(this.addToCart).click();
    }

    async checkIsProductPage(): Promise<void> {
        const currentURL = await this.driver.getCurrentUrl();
        expect(currentURL).toContain(urls.productPageURL);
    }

    countAddedItems: number = 0;

    async addAllProductsFromInventoryPage(): Promise<void> {
        const titles = await this.driver.findElements(this.itemTitles);

        try {
            for (let i = 0; i < titles.length; i++) {
                const currentTitles = await this.driver.findElements(this.itemTitles);
                const title = currentTitles[i];
                await title.click();

                await this.checkIsProductPage();

                const addToCart = await this.driver.findElement(By.xpath("//button[text()='Add to cart']"));
                await this.driver.wait(until.elementIsVisible(addToCart), 20000);
                await addToCart.click();

                const removeButton = await this.driver.findElement(By.xpath("//button[text()='Remove']"));
                await expect(await removeButton.isDisplayed()).toBe(true);

                const element = await this.driver.findElement(By.name('back-to-products'));
                await this.driver.wait(until.elementIsVisible(element), 20000);
                await element.click();

                this.countAddedItems++;
            }
        } catch (error) {
            console.error(`Error occurred because of ${error}`);
            throw error;
        }
    }
}

