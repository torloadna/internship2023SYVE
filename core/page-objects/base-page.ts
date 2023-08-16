import { By, WebDriver, until } from 'selenium-webdriver';
import DriverSetup from '../config/driver-setup';
import url from '../data/urls';

export default class Base {

  protected driver: WebDriver;

  protected cartIcon = By.id('shopping_cart_container');
  protected navigation = By.id('react-burger-menu-btn');
  protected logOutLink = By.id("logout_sidebar_link");
  protected resetAppLink = By.id("reset_sidebar_link");
  protected aboutLink = By.id("about_sidebar_link");
  protected closeBtn = By.id('react-burger-cross-btn');
  protected cartSpan = By.xpath('//*[@id="shopping_cart_container"]/a/span');
  protected sauceLabsBackpackButton = By.xpath("//div[text()='Sauce Labs Backpack']/../../../div[@class='pricebar']/button");

  constructor() {
    this.driver = DriverSetup.getInstance().getDriver();
  }

  async clickCartIcon(): Promise<void> {
    await this.driver.findElement(this.cartIcon).click();
  }

  async clickNavigation(): Promise<void> {
    await this.driver.findElement(this.navigation).click();
  }

  async logOut(): Promise<void> {
    this.clickNavigation();
    const element = await this.driver.findElement(this.logOutLink);
    await this.driver.wait(until.elementIsVisible(element), 20000);
    await element.click();
  }

  async clickResetAppState(): Promise<void> {
    this.clickNavigation();
    const element = await this.driver.findElement(this.resetAppLink);
    await this.driver.wait(until.elementIsVisible(element), 20000);
    await element.click();
    await this.driver.findElement(this.closeBtn).click();
  }

  async clickAbout(): Promise<void> {
    await this.clickNavigation();
    const element = await this.driver.findElement(this.aboutLink);
    await this.driver.wait(until.elementIsVisible(element), 20000);
    await element.click();
    expect(await this.driver.getCurrentUrl()).toContain(url.aboutPageURL);
  }

  async closeNavigation(): Promise<void> {
    await this.driver.findElement(this.closeBtn).click();
  }

  async getTextSauceLabsBackpackButton(): Promise<string> {
    const sauceLabsBackpackButtonText: string = await this.driver.findElement(this.sauceLabsBackpackButton).getText();
    return sauceLabsBackpackButtonText;
  }

  async isCartSpanDisplayed(): Promise<boolean> {
    try {
      const cartSpan: boolean = await this.driver.findElement(this.cartSpan).isDisplayed();
      return cartSpan;
    }
    catch {
      return false;
    }
  }

  async getTextCartSpan(): Promise<string> {
    const cartSpan: string = await this.driver.findElement(this.cartSpan).getText();
    return cartSpan;
  }

  async validateCartSpan(checker: boolean): Promise<void> {
    try {
      expect(await this.isCartSpanDisplayed()).toBe(checker);
    }
    catch (error) {
      console.error(`Element is not present because of ${error}`);
      throw error;
    }
  }

  async validateTextCartSpan(checker: string): Promise<void> {
    expect(await this.getTextCartSpan()).toMatch(checker);
  }
}