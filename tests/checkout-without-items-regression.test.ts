import LoginPage from "../core/page-objects/login-page";
import AllItems from "../core/page-objects/all-items-page";
import CartPage from "../core/page-objects/cart-page";
import DriverSetup from "../core/config/driver-setup";

import url from "../core/data/urls";
import users from "../core/data/users";

const driverInstance = DriverSetup.getInstance();
let allItems: AllItems;
let cartPage: CartPage;
let loginPage: LoginPage;

describe('Checkout without products - Regression', () => {

    beforeAll(() => {
        cartPage = new CartPage();
        loginPage = new LoginPage();
        allItems = new AllItems();
        driverInstance.openURL(url.sauceLabsURL);
    });

    test.each(users)('Checkout process without products', async (user) => {

        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();

        await allItems.clickCartIcon();

        await cartPage.validateEmptyCartList();
        await cartPage.clickCheckoutButton();
        await cartPage.checkIsAtCartPage();
        await cartPage.validateCartPageIsPresent();

    }, 30000);

    afterEach(async () => {
        await cartPage.logOut();
        await loginPage.checkIsLoginPage();
        await loginPage.validateLogOut();
        driverInstance.clearCookies();
    });

    afterAll(() => {
        driverInstance.turnOffDriver();
    });

})