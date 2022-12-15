import { test } from '@playwright/test';
import CartPage from '../pages/CartPage';
import CheckoutCompletePage from '../pages/CheckoutCompletePage';
import CheckoutOverviewPage from '../pages/CheckoutOverviewPage';
import InformationPage from '../pages/InformationPage';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';

test(`Verify that user can add a product to the cart and then can remove it`, async ({ page }) => {

  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutOverviewPage = new CheckoutOverviewPage(page);
  const informationPage = new InformationPage(page);
  const checkoutCompletePage = new CheckoutCompletePage(page);

  await test.step(`Log in as a standart user`, async () => {
    await loginPage.load();
    await loginPage.loginAsStandardUser();
    await loginPage.verifyLoginSuccessful();
  })

  await test.step(`Find 2 products by their name, then add it to the cart`, async () => {
    await productsPage.selectProductsAndAddToCart(2);
  })

  await test.step(`Go to the cart`, async () => {
    await productsPage.goToCart();
  })
  await test.step(`Verify that the products are added to the cart`, async () => {
    await cartPage.verifyProductsInCart();
  })

  await test.step(`Find an item by name, then remove it from the cart`, async () => {
    await cartPage.removeOneProductFromCart();
  })
  await test.step(`Verify that Checkout Overview does not contain the removed product and contains the other one`, async () => {
      await cartPage.goToCheckout();
      await informationPage.fillOutFormAndContinue();
      await checkoutOverviewPage.verifyProductsInCheckout();
    })
  await test.step(`Verify that item total is correct`, async () => {
    await checkoutOverviewPage.verifyItemTotalAsExpected();
  })
  await test.step(`Complete purchasing`, async () => {
    await checkoutOverviewPage.completePurchase();
  })
  await test.step(`Verify that the website confirms the order`, async () => {
    await checkoutCompletePage.verifyOrderConfirmed();
  })

});
