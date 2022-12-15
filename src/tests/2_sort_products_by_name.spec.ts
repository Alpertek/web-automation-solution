import { test } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';

test("Verify that sorting products by name in ascending and/or descending order works as expected", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await test.step(`Log in as a standart user`, async () => {
        await loginPage.load();
        await loginPage.loginAsStandardUser();
        await loginPage.verifyLoginSuccessful();
    })
    await test.step(`Select Name (A to Z) from sorting dropdown`, async () => {
        await productsPage.selectSortingName_A_to_Z();
    })
    await test.step(`Verify that products sorted by NAME in ASCENDING order`, async () => {
        await productsPage.verifyNamesAscending();
    })

    await test.step(`Select Name (Z to A) from sorting dropdown`, async () => {
        await productsPage.selectSortingName_Z_to_A();
    })
    await test.step(`Verify that products sorted by NAME in DESCENDING order`, async () => {
        await productsPage.verifyNamesDescending();
    })

})


