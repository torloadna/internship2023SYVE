import LoginPage from "../core/page-objects/login-page";
import AllItems from "../core/page-objects/all-items-page";
import urls from "../core/data/urls";
import DriverSetup from "../core/config/driver-setup";
import users from "../core/data/users";

let loginPage: LoginPage;
let allItems: AllItems;

const driverInstance = DriverSetup.getInstance();

describe("Validating logging out of the application", () => {
    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();

        driverInstance.openURL(urls.sauceLabsURL);
    });

    it.each(users)("Logging out from all items page", async (user) => {
        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.logOut();

        await loginPage.checkIsLoginPage();
        await loginPage.validateEmptyCredentialFields();
        await loginPage.validateLogOut();
    }, 20000);

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });
})