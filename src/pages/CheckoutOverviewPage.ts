import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import Product from "../utils/Product";

export default class CheckoutOverviewPage extends BasePage {


    private readonly productElementsInCheckout: Locator;
    private readonly actualItemTotalElement: Locator;
    private readonly finishBtn: Locator;

    private productsInCheckout: Product[] = [];

    private readonly productNameLocator: string = "div.cart_item_label .inventory_item_name";
    private readonly productPriceLocator: string = "div.cart_item_label .inventory_item_price";

    constructor(page: Page) {
        super(page);
        this.productElementsInCheckout = page.locator("div.cart_item");
        this.actualItemTotalElement = page.locator("div.summary_subtotal_label");
        this.finishBtn = page.locator("#finish");
    }

    private async updateProductListInCheckout() {
        let actualProductCount = await this.productElementsInCheckout.count();
        for (let i = 0; i < actualProductCount; i++) {
            const productElement = this.productElementsInCheckout.nth(i);
            const name = await productElement.locator(this.productNameLocator).textContent();
            const productPriceElement = productElement.locator(this.productPriceLocator);
            const price = await this.extractProductPrice(productPriceElement, 1);
            const product = new Product(name, price);
            this.productsInCheckout.push(product);
        }
    }

    async verifyProductsInCheckout() {
        await this.updateProductListInCheckout();
        expect(this.productsInCheckout).toMatchObject(BasePage.productsInCart);
        expect(this.productsInCheckout).not.toContainEqual(BasePage.productToRemove);
    }
    async verifyItemTotalAsExpected() {
        let expectedItemTotal = BasePage.productsInCart.map((product)=> product.price).reduce((total, value) => total + value, 0);        
        let actualItemTotal = await this.extractProductPrice(this.actualItemTotalElement, 1);                        
        expect(actualItemTotal).toBe(expectedItemTotal);
    }

    async completePurchase() {
        await this.finishBtn.click();
        await expect(this.pageTitleElement).toHaveText("Checkout: Complete!");
    }
}