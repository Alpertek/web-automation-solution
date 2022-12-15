import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class CheckoutCompletePage extends BasePage {

    private readonly resultElement: Locator;

    constructor(page: Page) {
        super(page);
        this.resultElement = page.locator("#checkout_complete_container");
    }

    async verifyOrderConfirmed() {
        await expect(this.resultElement).toContainText("THANK YOU FOR YOUR ORDER");
        await expect(this.resultElement).toContainText("Your order has been dispatched");
    }
}