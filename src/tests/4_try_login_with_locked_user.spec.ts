import test from "@playwright/test";
import LoginPage from "../pages/LoginPage";


/**
 * this test is written to fail to show that the failure is shown in a screenshot and a video attached to the html report
*/
test("Verify that user can log in as a `locked out` user", async ({ page }) => {

    const loginPage = new LoginPage(page);

    await test.step(`Go to login page`, async()=>{
        await loginPage.load();
    })
    await test.step(`Log in as a locked out user`, async()=>{
        await loginPage.tryLoginAsLockedUser();
        await loginPage.verifyLoginSuccessful();
    })
})