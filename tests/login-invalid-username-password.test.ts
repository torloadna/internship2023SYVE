import DriverSetup from "../core/config/driver-setup";
import urls from "../core/data/urls";
import invalid_user from "../core/data/invalid_user.json";
import LoginPage from "../core/page-objects/login-page";

let loginPage : LoginPage;

const driverInstance = DriverSetup.getInstance();

describe('Testing login using invalid data' , ()=> {

    beforeAll(async ()=>{
        loginPage = new LoginPage();
        driverInstance.openURL(urls.sauceLabsURL);
    });

    it("Checking logging in with invalid username and password", async ()=>{
        await loginPage.checkIsLoginPage();
        await loginPage.enterUsername(invalid_user.credentials.username);
        await loginPage.enterPassword(invalid_user.credentials.password);
        await loginPage.clickLoginButton();
        await loginPage.validateMessageDisplayed();
        await loginPage.checkIsLoginPage();
    }, 10000);

    afterAll(async () => {
        driverInstance.turnOffDriver();
    });
})