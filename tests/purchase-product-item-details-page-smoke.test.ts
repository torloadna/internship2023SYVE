import LoginPage from "../core/page-objects/login-page";
import AllItems from "../core/page-objects/all-items-page";
import SauceLabsBackpack from "../core/page-objects/product-page"
import Cart from "../core/page-objects/cart-page";
import Checkout from "../core/page-objects/checkout-form-page"
import CheckoutOverview from "../core/page-objects/checkout-overview-page";
import CheckoutComplete from "../core/page-objects/checkout-complete-page";
import DriverSetup from "../core/config/driver-setup";
import users from "../core/data/users";
import urls from "../core/data/urls";

let loginPage: LoginPage;
let allItems: AllItems;
let sauceLabsBackpack: SauceLabsBackpack;
let cart: Cart;
let checkout: Checkout;
let checkoutOverview: CheckoutOverview;
let checkoutComplete: CheckoutComplete;

const driverInstance = DriverSetup.getInstance();

describe('Checkout process with adding item from item details page', () => {

    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        sauceLabsBackpack = new SauceLabsBackpack();
        cart = new Cart();
        checkout = new Checkout();
        checkoutOverview = new CheckoutOverview();
        checkoutComplete = new CheckoutComplete();
        driverInstance.openURL(urls.sauceLabsURL);
    });

    it.each(users)("Purchase from product page", async (user) => {
        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.clickSauceBackpack();

        await sauceLabsBackpack.checkIsProductPage();
        await sauceLabsBackpack.clickAddToCartButton();
        await sauceLabsBackpack.validateRemoveButton('Remove');
        await sauceLabsBackpack.clickCartIcon();

        await cart.checkIsAtCartPage();
        await cart.validateCartList('Sauce Labs');
        await cart.clickCheckoutButton();

        await checkout.checkIsAtCheckoutFormPage();
        await checkout.fillOutForm();
        await checkout.clickContinueButton();

        await checkoutOverview.checkIsAtCheckoutOverview();
        await checkoutOverview.clickFinishButton();
        await checkoutComplete.validateCheckoutCompleted("Thank you for your order!");
        await checkoutComplete.clickBackHomeButton();

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