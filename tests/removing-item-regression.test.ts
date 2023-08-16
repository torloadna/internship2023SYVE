import LoginPage from "../core/page-objects/login-page";
import AllItems from "../core/page-objects/all-items-page";
import ProductPage from "../core/page-objects/product-page";
import urls from "../core/data/urls";
import DriverSetup from "../core/config/driver-setup";
import users from "../core/data/users";

let loginPage: LoginPage;
let allItems: AllItems;
let productPage: ProductPage;

const driverInstance = DriverSetup.getInstance();

describe("Validate removing item from cart", () => {
    beforeAll(async () => {
        loginPage = new LoginPage();
        allItems = new AllItems();
        productPage = new ProductPage();

        driverInstance.openURL(urls.sauceLabsURL);
    });

    it.each(users)("Validate removing item from all items page and cart", async (user) => {

        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await allItems.checkIsAtAllItemsPage();
        await allItems.validateTitleAllItemsPage('Products');
        await allItems.clickAddToCartButtonSauceLabsBackpack();
        await allItems.validateRemoveButtonSauceLabsBackpack('Remove');
        await allItems.validateCartSpan(true);
        await allItems.validateTextCartSpan("1");
        await allItems.clickRemoveButtonSauceLabsBackpack();
        await allItems.clickSauceBackpack();
        await allItems.validateCartSpan(false);

        await productPage.checkIsProductPage();
        await productPage.clickAddToCartButton();
        await productPage.validateRemoveButton('Remove');
        await productPage.validateCartSpan(true);
        await productPage.validateTextCartSpan("1");
        await productPage.clickRemoveButton();
        await allItems.validateCartSpan(false);

    }, 20000);

    afterEach(async () => {
        await allItems.logOut();
        await loginPage.validateLogOut();

        driverInstance.clearCookies();
    });

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });
})