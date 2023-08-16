import { By, WebDriver } from 'selenium-webdriver';
import DriverSetup from '../config/driver-setup';
import urls from '../data/urls';

export default class LoginPage {
  private driver: WebDriver;

  private usernameInput = By.id("user-name");
  private passwordInput = By.id("password");
  private loginButton = By.id('login-button');
  private errorMessage = By.className("error-message-container error");

  constructor() {
    this.driver = DriverSetup.getInstance().getDriver();
  }

  async enterUsername(username: string): Promise<void> {
    await this.driver.findElement(this.usernameInput).sendKeys(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.driver.findElement(this.passwordInput).sendKeys(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.driver.findElement(this.loginButton).click();
  }

  async isButtonDisplayed(): Promise<boolean> {
    const loginButtonState: boolean = await this.driver.findElement(this.loginButton).isDisplayed();
    return loginButtonState;
  }

  async validateLogOut(): Promise<void> {
    expect(await this.isButtonDisplayed()).toBeTruthy();
  }

  async checkIsLoginPage(): Promise<void> {
    const currentURL = await this.driver.getCurrentUrl();
    expect(currentURL).toContain(urls.sauceLabsURL);
  }

  async getErrorMessageText(): Promise<string> {
    const errorMessageText: string = await this.driver.findElement(this.errorMessage).getText();
    return errorMessageText;
  }

  async validateMessageDisplayed(): Promise<void> {
    expect(this.errorMessage).toBeDefined();
    expect(await this.getErrorMessageText()).toEqual("Epic sadface: Username and password do not match any user in this service");
  }

  async getUsernameText(): Promise<string> {
    const usernameText: string = await this.driver.findElement(this.usernameInput).getText();
    return usernameText;
  }

  async getPasswordText(): Promise<string> {
    const passwordText: string = await this.driver.findElement(this.passwordInput).getText();
    return passwordText;
  }

  async validateEmptyCredentialFields(): Promise<void> {
    expect(await this.getUsernameText()).toEqual("");
    expect(await this.getPasswordText()).toEqual("");
  }
}
