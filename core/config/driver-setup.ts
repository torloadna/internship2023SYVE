import { Builder, WebDriver } from 'selenium-webdriver';

export default class DriverSetup {

    private static instance: DriverSetup;
    private driver: WebDriver;

    private constructor() {
        this.driver = this.driverBuildUp();
    }

    public static getInstance(): DriverSetup {
        if (DriverSetup.instance == null) {
            DriverSetup.instance = new DriverSetup()
        }

        return DriverSetup.instance;
    }

    private driverBuildUp() {
        return new Builder().forBrowser('chrome').build();
    }

    public getDriver(): WebDriver {
        return this.driver;
    }

    public async maxWindow(): Promise<void> {
        await this.driver.manage().window().maximize();
    }

    public async openURL(url: string): Promise<void> {
        await this.driver.get(url);
        await this.maxWindow();

    }

    public async clearCookies(): Promise<void> {
        await this.driver.manage().deleteAllCookies();
    }

    public async turnOffDriver(): Promise<void> {
        await this.driver.quit();
    }

    public async navigateBack(): Promise<void> {
        await this.driver.navigate().back();
    }

    public async sleep(): Promise<void> {
        await this.driver.sleep(2000);
    }
}
