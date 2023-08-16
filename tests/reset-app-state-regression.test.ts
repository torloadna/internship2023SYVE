import DriverSetup from "../core/config/driver-setup";
import LoginPage from '../core/page-objects/login-page'
import AllItems from "../core/page-objects/all-items-page";
import CartPage from "../core/page-objects/cart-page";
import urls from "../core/data/urls";
import users from "../core/data/users";

let allItems: AllItems;
let loginPage: LoginPage;
let cartPage: CartPage;
const driverInstance = DriverSetup.getInstance();

describe('Reset app state - regression test', () => {

    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        cartPage = new CartPage();
        driverInstance.openURL(urls.sauceLabsURL);
    });

    test.each(users)("Resetting app state with All items added to cart", async (user) => {

        await loginPage.checkIsLoginPage();

        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();

        await allItems.clickAddToCartButtonSauceLabsBackpack();

        await allItems.validateRemoveButtonSauceLabsBackpack('Remove');
        await allItems.validateCartSpan(true);
        await allItems.validateTextCartSpan('1');

        await allItems.clickAddToCartButtonSauceLabsBikeLight();

        await allItems.validateRemoveButtonSauceLabsBikeLight('Remove');
        await allItems.validateCartSpan(true);
        await allItems.validateTextCartSpan('2');

        await allItems.clickResetAppState();
        await allItems.validateCartSpan(false);
        await allItems.validateAddToCartButton('Add to cart');
        await allItems.clickCartIcon();

        await cartPage.checkIsAtCartPage();
        await cartPage.validateEmptyCartList();

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

