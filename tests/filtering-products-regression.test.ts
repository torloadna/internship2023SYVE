import users from "../core/data/users"
import DriverSetup from "../core/config/driver-setup"
import url from "../core/data/urls";
import LoginPage from "../core/page-objects/login-page";
import AllItems from "../core/page-objects/all-items-page";

const driverInstance = DriverSetup.getInstance();
let loginPage: LoginPage;
let allItems: AllItems;

describe('Filtering products regression test', () => {

    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        driverInstance.openURL(url.sauceLabsURL)
    });

    test.each(users)('Filtering products on all items page regression test', async (user) => {

        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.filterProducts();
        await allItems.checkIsAtAllItemsPage();
        
    }, 40000);

    afterEach(async () => {
        await allItems.logOut();
        await loginPage.checkIsLoginPage();
        await loginPage.validateLogOut();

        driverInstance.clearCookies();
    });

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });
});