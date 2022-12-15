import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import Product from "../utils/Product";

export default class CartPage extends BasePage {

    private readonly productElements: Locator;
    private readonly checkoutBtn: Locator;
    private readonly productNameLocator: string = "div.inventory_item_name";
    private readonly productPriceLocator: string = ".inventory_item_price";
    private readonly relatedRemoveBtn: string = "button.cart_button";

    constructor(page: Page) {
        super(page);
        this.productElements = page.locator(".cart_item");
        this.checkoutBtn = page.locator("button#checkout");
    }

    async verifyProductsInCart() {
        await this.updateProductListInCart();        
        expect(BasePage.productsInCart).toMatchObject(BasePage.selectedProductList);
    }

    private async updateProductListInCart() {
        BasePage.productsInCart = [];
        
        const productCountInCart = await this.productElements.count();
        for (let i = 0; i < productCountInCart; i++) {
            const name = await this.productElements.nth(i).locator(this.productNameLocator).textContent();
            const productPriceElement = this.productElements.nth(i).locator(this.productPriceLocator);
            const price = await this.extractProductPrice(productPriceElement, 1);
            const product = new Product(name, price);
            BasePage.productsInCart.push(product);
        }
    }

    async removeOneProductFromCart() {        
        let totalProductCount = await this.productElements.count();
        let nthProduct = Math.floor(Math.random() * totalProductCount);        
        BasePage.productToRemove = BasePage.productsInCart[nthProduct];
        let productToBeRemoved = this.productElements.nth(nthProduct);
        await productToBeRemoved.locator(this.relatedRemoveBtn).click();
        await this.updateProductListInCart();        
        expect(BasePage.productsInCart).not.toContainEqual(BasePage.productToRemove);
    }

    async goToCheckout() {
        await this.checkoutBtn.click();
        await this.page.waitForLoadState("load");
    }




}