import DriverSetup from "../core/config/driver-setup";
import LoginPage from '../core/page-objects/login-page'
import AllItems from "../core/page-objects/all-items-page";
import CartPage from "../core/page-objects/cart-page";
import CheckoutFormPage from "../core/page-objects/checkout-form-page";
import CheckoutOverviewPage from "../core/page-objects/checkout-overview-page";
import CheckoutCompletePage from "../core/page-objects/checkout-complete-page";
import urls from "../core/data/urls";
import users from "../core/data/users";

let allItems: AllItems;
let checkoutFormPage: CheckoutFormPage;
let checkoutCompletePage: CheckoutCompletePage;
let loginPage: LoginPage;
let cartPage: CartPage;
let checkoutOverviewPage: CheckoutOverviewPage;
const driverInstance = DriverSetup.getInstance();

describe('Checkout process with adding item from All items page', () => {
    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        cartPage = new CartPage();
        checkoutCompletePage = new CheckoutCompletePage();
        checkoutOverviewPage = new CheckoutOverviewPage();
        checkoutFormPage = new CheckoutFormPage();
        driverInstance.openURL(urls.sauceLabsURL);
    });

    test.each(users)("Checkout with adding item from 'All items' page", async (user) => {

        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.validateTitleAllItemsPage('Products');
        await allItems.clickAddToCartButtonSauceLabsBackpack();
        await allItems.validateRemoveButtonSauceLabsBackpack('Remove');
        await allItems.validateCartSpan(true);
        await allItems.validateTextCartSpan('1');
        await allItems.clickCartIcon();

        await cartPage.checkIsAtCartPage();
        await cartPage.validateCartList('Sauce Labs');
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

