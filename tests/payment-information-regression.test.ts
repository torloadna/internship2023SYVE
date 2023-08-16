import LoginPage from "../core/page-objects/login-page";
import AllItems from "../core/page-objects/all-items-page";
import Cart from "../core/page-objects/cart-page";
import Checkout from "../core/page-objects/checkout-form-page"
import CheckoutOverview from "../core/page-objects/checkout-overview-page";
import DriverSetup from "../core/config/driver-setup";
import users from "../core/data/users";
import urls from "../core/data/urls";

let loginPage: LoginPage;
let allItems: AllItems;
let cart: Cart;
let checkout: Checkout;
let checkoutOverview: CheckoutOverview;

const driverInstance = DriverSetup.getInstance();

describe('Payment information (total price, price with tax) - regression test', () => {
    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        cart = new Cart();
        checkout = new Checkout();
        checkoutOverview = new CheckoutOverview();

        driverInstance.openURL(urls.sauceLabsURL);
    });

    it.each(users)("Checking payment information:", async (user) => {

        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.clickAddToCartButtons();
        await allItems.validateRemoveButtonSauceLabsBackpack('Remove');
        await allItems.validateTextCartSpan("6");
        await allItems.clickCartIcon();

        await cart.checkIsAtCartPage();
        await cart.validateCartItems(allItems.count);
        await cart.clickCheckoutButton();

        await checkout.checkIsAtCheckoutFormPage();
        await checkout.fillOutForm();
        await checkout.clickContinueButton();

        await checkoutOverview.checkIsAtCheckoutOverview();
        await checkoutOverview.validatePaymentInformation();

    }, 60000);

    afterEach(async () => {
        await allItems.logOut();
        await loginPage.validateLogOut();

        driverInstance.clearCookies();
    });

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });

})

