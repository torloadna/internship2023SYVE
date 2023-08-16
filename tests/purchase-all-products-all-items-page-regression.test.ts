import DriverSetup from "../core/config/driver-setup";
import AllItems from "../core/page-objects/all-items-page";
import LoginPage from "../core/page-objects/login-page";
import CartPage from "../core/page-objects/cart-page";
import CheckoutFormPage from "../core/page-objects/checkout-form-page";
import CheckoutOverviewPage from "../core/page-objects/checkout-overview-page";
import CheckoutCompletePage from "../core/page-objects/checkout-complete-page";

import url from "../core/data/urls";
import users from "../core/data/users";

const driverInstance = DriverSetup.getInstance();
let allItems: AllItems;
let checkoutFormPage: CheckoutFormPage;
let checkoutCompletePage: CheckoutCompletePage;
let loginPage: LoginPage;
let cartPage: CartPage;
let checkoutOverviewPage: CheckoutOverviewPage;

describe('User can checkout with all items - regression', () => {

    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        cartPage = new CartPage();
        checkoutCompletePage = new CheckoutCompletePage();
        checkoutOverviewPage = new CheckoutOverviewPage();
        checkoutFormPage = new CheckoutFormPage();
        driverInstance.openURL(url.sauceLabsURL);
    });


    test.each(users)('Checkout with all products from "All items" page', async (user) => {

        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.clickAddToCartButtons();
        await allItems.validateCartSpan(true);
        await allItems.validateTextCartSpan('6');
        await allItems.validateRemoveButtons();
        await allItems.clickCartIcon();

        await cartPage.checkIsAtCartPage();
        await cartPage.validateCartItems(allItems.count);
        await cartPage.clickCheckoutButton();

        await checkoutFormPage.checkIsAtCheckoutFormPage();
        await checkoutFormPage.fillOutForm();
        await checkoutFormPage.clickContinueButton();

        await checkoutOverviewPage.checkIsAtCheckoutOverview();
        await checkoutOverviewPage.validateCheckoutOverviewPageTitle('Checkout: Overview');
        await checkoutOverviewPage.clickFinishButton();

        await checkoutCompletePage.checkIsAtCheckoutComplete();
        await checkoutCompletePage.validateCheckoutCompleted('Thank you for your order!');
        await checkoutCompletePage.clickBackHomeButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.validateTitleAllItemsPage('Products');
        await allItems.clickResetAppState();

    }, 50000);

    afterEach(async () => {
        allItems.count = 0;
        await allItems.logOut();
        await loginPage.checkIsLoginPage();
        await loginPage.validateLogOut();
        driverInstance.clearCookies();
    });

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });

});