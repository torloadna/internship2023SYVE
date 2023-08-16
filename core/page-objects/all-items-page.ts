import { By, WebElement } from 'selenium-webdriver';
import DriverSetup from '../config/driver-setup';
import urls from '../data/urls';
import { SortOrder } from './sort-order';
import Base from './base-page';

export default class AllItems extends Base {

  private title = By.xpath('//div[@class="header_secondary_container"]/span');
  private sauceLabsBackpack = By.id('item_4_title_link');
  private buttons = By.xpath('//div[@class="pricebar"]/button');
  private sauceLabsBikeLightButton = By.xpath("//div[text()='Sauce Labs Bike Light']/../../../div[@class='pricebar']/button");
  private numberItemCart = By.className("shopping_cart_badge");
  private itemPrices = By.className('inventory_item_price');
  private itemTitles = By.className('inventory_item_name');
  private firstDivTitle = By.xpath("//div[@class='inventory_item'][1]/div[@class='inventory_item_description']/div[@class='inventory_item_label']/a/div");
  private firstDivPrice = By.xpath("//div[@class='inventory_item'][1]/div[@class='inventory_item_description']/div[@class='pricebar']/div[@class='inventory_item_price']");
  private options = By.xpath("//select[@class='product_sort_container']/option");
  private twitterLink = By.className('social_twitter');
  private facebookLink = By.className('social_facebook');
  private linkedinLink = By.className('social_linkedin');
  private removeSauceLabsBackpack = By.id("remove-sauce-labs-backpack");

  constructor() {
    super();
    this.driver = DriverSetup.getInstance().getDriver();
  }

  async clickAddToCartButtonSauceLabsBackpack(): Promise<void> {
    await this.driver.findElement(this.sauceLabsBackpackButton).click();
  }

  async clickAddToCartButtonSauceLabsBikeLight(): Promise<void> {
    await this.driver.findElement(this.sauceLabsBikeLightButton).click();
  }

  async getTitleAllItemsPage(): Promise<string> {
    const title: string = await this.driver.findElement(this.title).getText();
    return title;
  }

  async clickRemoveButtonSauceLabsBackpack(): Promise<void> {
    await this.driver.findElement(this.removeSauceLabsBackpack).click();
  }

  async validateTitleAllItemsPage(checker: string): Promise<void> {
    expect(await this.getTitleAllItemsPage()).toMatch(checker);
  }

  async validateRemoveButtonSauceLabsBackpack(checker: string): Promise<void> {
    expect(await this.getTextSauceLabsBackpackButton()).toMatch(checker);
  }

  async validateRemoveButtonSauceLabsBikeLight(checker: string): Promise<void> {
    expect(await this.getTextSauceLabsBikeLightButton()).toMatch(checker);
  }

  async checkIsAtAllItemsPage(): Promise<void> {
    const currentURL = await this.driver.getCurrentUrl();
    expect(currentURL).toContain(urls.allItemsURL);
  }

  async clickSauceBackpack(): Promise<void> {
    await this.driver.findElement(this.sauceLabsBackpack).click();
  }

  count: number = 0;

  async clickAddToCartButtons(): Promise<void> {
    let buttons = await this.driver.findElements(this.buttons);
    let button: WebElement;
    for (button of buttons) {
      if (await button.getText() === 'Add to cart') {
        this.count++;
        button.click();
      }
    }
  }

  async validateRemoveButtons(): Promise<void> {
    let buttons = await this.driver.findElements(this.buttons);
    let button: WebElement;
    for (button of buttons) {
      expect(await button.getText()).toMatch('Remove');
    }
  }

  async getTextSauceLabsBackpackButton(): Promise<string> {
    const sauceLabsBackpackButtonText: string = await this.driver.findElement(this.sauceLabsBackpackButton).getText();
    return sauceLabsBackpackButtonText;
  }

  async getTextSauceLabsBikeLightButton(): Promise<string> {
    const sauceLabsBikeLightText: string = await this.driver.findElement(this.sauceLabsBikeLightButton).getText();
    return sauceLabsBikeLightText;
  }

  async validateAddToCartButton(checker: string): Promise<void> {
    expect(await this.getTextSauceLabsBackpackButton() && await this.getTextSauceLabsBikeLightButton()).toMatch(checker);
  }

  async getNumberCartItems(): Promise<string> {
    const numberItemCartText: string = await this.driver.findElement(this.numberItemCart).getText();
    return numberItemCartText;
  }

  async sortPrices() {
    let prices = await this.driver.findElements(this.itemPrices);
    const priceArray = [];

    for (let price of prices) {
      let priced = (await price.getText()).slice(1);
      priceArray.push(Number(priced));
    }
    priceArray.sort((a, b) => {
      return a - b;
    });
    return priceArray;
  }

  async getSortedPricesLow() {
    let priceArray = await this.sortPrices();
    const sortedPricesWithDollarSign = priceArray.map((price) => `$${price}`);
    return sortedPricesWithDollarSign;
  }

  async getSortedPricesHigh() {
    let priceArray = await this.sortPrices();
    priceArray.reverse();
    const sortedPricesWithDollarSign = priceArray.map((price) => `$${price}`);
    return sortedPricesWithDollarSign;
  }

  async getSortedTitlesDesc() {
    let titlesArray = await this.getSortedTitlesAsc();
    return titlesArray.reverse();
  }

  async getSortedTitlesAsc() {
    let titles = await this.driver.findElements(this.itemTitles);
    const titlesArray = [];

    for (let title of titles) {
      let titled = await title.getText();
      titlesArray.push(titled);
    }

    return titlesArray.sort();
  }
  async filterProducts(): Promise<void> {

    let sortedPricesToLow = await this.getSortedPricesLow();
    let sortedPricesToHigh = await this.getSortedPricesHigh();
    let titlesAsc = await this.getSortedTitlesAsc();
    let titlesDesc = await this.getSortedTitlesDesc();

    const options = await this.driver.findElements(this.options);

    for (let i = 0; i < options.length; i++) {
      const currentOption = await this.driver.findElements(this.options);
      const option = currentOption[i];

      let check = await option.getText();

      await option.click();

      let priceDiv = await this.driver.findElement(this.firstDivPrice).getText();
      let titleDiv = await this.driver.findElement(this.firstDivTitle).getText();

      switch (true) {
        case (check === SortOrder.Ascending):
          expect(titleDiv).toEqual(titlesAsc[0]);
          break;
        case (check === SortOrder.Descending):
          expect(titleDiv).toEqual(titlesDesc[0]);
          break;
        case (check === SortOrder.LowerPrice):
          expect(priceDiv).toEqual(sortedPricesToLow[0]);
          break;
        case (check === SortOrder.HigherPrice):
          expect(priceDiv).toEqual(sortedPricesToHigh[0]);
          break;
        default:
          continue;
      }
    }
  }

  async clickTwitterIcon(): Promise<void> {
    await this.driver.findElement(this.twitterLink).click();
  }

  async clickFacebookIcon(): Promise<void> {
    await this.driver.findElement(this.facebookLink).click();
  }

  async clickLinkedinIcon(): Promise<void> {
    await this.driver.findElement(this.linkedinLink).click();
  }

  async validateSocialMedia(checker: string): Promise<void> {

    let allTabs = await this.driver.getAllWindowHandles();
    await this.driver.switchTo().window(allTabs[1]);

    const currentUrl = await this.driver.getCurrentUrl();

    expect(await currentUrl).toContain(checker);

    await this.driver.close();
    allTabs.pop();
    await this.driver.switchTo().window(allTabs[0]);

  }
}