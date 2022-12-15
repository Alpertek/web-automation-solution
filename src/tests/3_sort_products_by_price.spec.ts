import { test } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';

test("Verify that sorting products by their price in ascending or descending order works as expected", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await test.step(`Log in as a standart user`, async () => {
        await loginPage.load();
        await loginPage.loginAsStandardUser();
        await loginPage.verifyLoginSuccessful();
    })
    await test.step(`Select Price (low to high) from product sorting dropdown`, async () => {
        await productsPage.selectPriceLowToHigh();
    })
    await test.step(`Verify that products sorted by PRICE in ASCENDING order`, async () => {
        await productsPage.verifyPricesAscending();
    })

    await test.step(`Then select Price (high to low) from sorting dropdown`, async () => {
        await productsPage.selectPriceHighToLow();
    })
    await test.step(`Verify that products sorted by PRICE in DESCENDING order`, async () => {
        await productsPage.verifyPricesDescending();
    })

})


