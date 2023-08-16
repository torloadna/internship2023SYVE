import DriverSetup from "../core/config/driver-setup";
import LoginPage from "../core/page-objects/login-page";
import AllItems from "../core/page-objects/all-items-page";

import users from "../core/data/users"
import url from "../core/data/urls";

let loginPage: LoginPage;
let allItems: AllItems;
const driverInstance = DriverSetup.getInstance();

describe('User can visit social media links in footer - regression test', () => {

    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        driverInstance.openURL(url.sauceLabsURL);
    });

    test.each(users)('Users can visit social media links in footer ', async (user) => {

        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();

        await allItems.clickTwitterIcon();
        await allItems.validateSocialMedia(url.twitterURL);

        await allItems.clickFacebookIcon();
        await allItems.validateSocialMedia(url.facebookURL);

        await allItems.clickLinkedinIcon();
        await allItems.validateSocialMedia(url.linkedinURL);

        await allItems.checkIsAtAllItemsPage();

    }, 40000);

    afterEach(async () => {

        await allItems.logOut();
        await loginPage.validateLogOut();
        await loginPage.checkIsLoginPage();

        driverInstance.clearCookies();
    });

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });
});