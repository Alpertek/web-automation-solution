import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import Product from "../utils/Product";


export default class ProductsPage extends BasePage {

    private readonly availableProductElements: Locator;
    private readonly cartIcon: Locator;
    // these 3 string variables are the locator strings for child elements of a parent element that contains a product
    // these are used after the product is selected randomly, then the related child elements are located.
    private readonly productNameLocatorStr: string = "div.inventory_item_name";
    private readonly productPriceLocatorStr: string = "div.inventory_item_price";
    private readonly relatedAddToCartBtnLocatorStr: string = "button.btn_inventory";
    private selectedProduct: Locator;
    private readonly sortingOptions: Locator;
    private expectedProductNames: string[] = [];
    private expectedProductPrices: number[] = [];
    private actualProductNames: string[] = [];
    private actualProductPrices: number[] = [];

    constructor(page: Page) {
        super(page);
        this.availableProductElements = page.locator("//div[@class='inventory_item'][not(contains(.,'Remove'))]");
        this.cartIcon = page.locator("#shopping_cart_container > a");
        this.sortingOptions = page.locator("select.product_sort_container");
    }

    /**
     * @param countOfProductsToAdd is the count of products that you want to add to the cart
     * @description this method adds product(s) to the cart
     */
    async selectProductsAndAddToCart(countOfProductsToAdd: number) {
        const totalProductCountInPage = await this.availableProductElements.count();
        if (countOfProductsToAdd > 0 && countOfProductsToAdd <= totalProductCountInPage) {
            for (let i = 0; i < countOfProductsToAdd; i++) {
                await this.selectRandomProductAndAddToCart();
            }
        } else {
            throw new Error(`You cannot add ${countOfProductsToAdd} products to cart. Because there are ${totalProductCountInPage} products in total in page.`)
        }
    }
    /**
     * @description this method randomly adds a product to cart after checking if it is 
     * not added to cart already and keeps list of it updated to verify later in the Cart page
     */
    private async selectRandomProductAndAddToCart() {
        const totalProductCount = await this.availableProductElements.count()
        const nthProduct = Math.floor(Math.random() * totalProductCount);
        this.selectedProduct = this.availableProductElements.nth(nthProduct);
        const productName = await this.selectedProduct.locator(this.productNameLocatorStr).textContent();
        const productPriceElement = this.selectedProduct.locator(this.productPriceLocatorStr);
        const productPrice = await this.extractProductPrice(productPriceElement, 1);
        const product = new Product(productName, productPrice);
        ProductsPage.selectedProductList.push(product);
        await this.selectedProduct.locator(this.relatedAddToCartBtnLocatorStr).click();
    }
    /**
     * @description this method collects the product names in the current sorted order and updates the list.
     * it is invoked when a sorting option is implemented in the page
     */
     private async collectProductNames() {
        this.actualProductNames = await this.page.locator(this.productNameLocatorStr).allTextContents();
    }
    /**
     * @description this method collects the product prices in the current sorted order and updates the list.
     * it is invoked when a sorting option is implemented in the page
     */
    private async collectProductPrices() {
        this.actualProductPrices = (await this.page.locator(this.productPriceLocatorStr).allTextContents()).map((priceText) => Number.parseFloat(priceText.substring(1)));
    }

    async goToCart() {
        await this.cartIcon.click();
        await expect(this.pageTitleElement).toHaveText("Your Cart");
    }

    async selectSortingName_A_to_Z() {
        await this.sortingOptions.selectOption({ value: "az" });
        expect(await this.sortingOptions.inputValue()).toBe("az");
        await this.collectProductNames();
    }
    async selectSortingName_Z_to_A() {
        await this.sortingOptions.selectOption({ value: "za" });
        expect(await this.sortingOptions.inputValue()).toBe("za");
        await this.collectProductNames();
    }

    async verifyNamesAscending() {
        this.expectedProductNames = this.actualProductNames.slice();
        this.expectedProductNames.sort();
        expect(this.actualProductNames).toEqual(this.expectedProductNames)
    }
    async verifyNamesDescending() {
        this.expectedProductNames = this.actualProductNames.slice();
        this.expectedProductNames.sort();
        this.expectedProductNames.reverse();
        expect(this.actualProductNames).toEqual(this.expectedProductNames);
    }
    async selectPriceLowToHigh() {
        await this.selectRelatedPriceSortingOption("lohi");
    }
    async selectPriceHighToLow() {
        await this.selectRelatedPriceSortingOption("hilo")
    }
    private async selectRelatedPriceSortingOption(optionValue: string) {
        await this.sortingOptions.selectOption({ value: optionValue });
        expect(await this.sortingOptions.inputValue()).toBe(optionValue);
        await this.collectProductPrices();
    }
    async verifyPricesAscending() {
        this.expectedProductPrices = this.actualProductPrices.slice();
        this.expectedProductPrices.sort((a, b) => a - b); // sorts price list in ascending order
        expect(this.actualProductPrices).toEqual(this.expectedProductPrices);
    }

    async verifyPricesDescending() {
        this.expectedProductPrices = this.actualProductPrices.slice();
        this.expectedProductPrices.sort((a, b) => b - a); // sorts price list in descending order
        expect(this.actualProductPrices).toEqual(this.expectedProductPrices);
    }
}