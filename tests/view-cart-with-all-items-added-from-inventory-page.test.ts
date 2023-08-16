import DriverSetup from "../core/config/driver-setup";
import LoginPage from "../core/page-objects/login-page";
import AllItems from "../core/page-objects/all-items-page";
import ProductPage from "../core/page-objects/product-page";
import CartPage from "../core/page-objects/cart-page";
import users from "../core/data/users";
import url from "../core/data/urls";

const driverInstance = DriverSetup.getInstance();
let loginPage: LoginPage;
let allItems: AllItems;
let productPage: ProductPage;
let cartPage: CartPage;

describe('Regression test - User can view cart after adding all items from inventory items page', () => {

    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        productPage = new ProductPage();
        cartPage = new CartPage();

        driverInstance.openURL(url.sauceLabsURL)
    });

    test.each(users)('User can view cart after adding all items from inventory items page', async (user) => {

        await loginPage.checkIsLoginPage();

        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();

        await productPage.addAllProductsFromInventoryPage();

        await allItems.validateRemoveButtons();
        await allItems.validateCartSpan(true);
        await allItems.clickCartIcon();

        await cartPage.checkIsAtCartPage();
        await cartPage.validateCartItems(productPage.countAddedItems);

        await allItems.clickResetAppState();
        await allItems.validateCartSpan(false);

    }, 40000);

    afterEach(async () => {
        productPage.countAddedItems = 0;
        await allItems.logOut();
        await loginPage.checkIsLoginPage();
        await loginPage.validateLogOut();
        driverInstance.clearCookies();
    });

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });

});