import DriverSetup from "../core/config/driver-setup";
import LoginPage from '../core/page-objects/login-page'
import AllItems from "../core/page-objects/all-items-page";
import urls from "../core/data/urls";
import users from "../core/data/users";

let allItems: AllItems;
let loginPage: LoginPage;

const driverInstance = DriverSetup.getInstance();

describe('Validating "About" page, in navigation', () => {
    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();

        driverInstance.openURL(urls.sauceLabsURL);
    });

    test.each(users)("Validating if user can open 'About' page from 'All items' page", async (user) => {

        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.clickAbout();

        await driverInstance.navigateBack();

        await allItems.checkIsAtAllItemsPage();
        await allItems.closeNavigation();
    }, 40000);

    afterEach(async () => {
        await allItems.logOut();
        await loginPage.validateLogOut();

        driverInstance.clearCookies();
    });

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });

})

