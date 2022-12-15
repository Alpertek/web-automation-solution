import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class InformationPage extends BasePage {

    private readonly firstnameInput: Locator;
    private readonly lastnameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueBtn : Locator;

    constructor(page: Page) {
        super(page);
        this.firstnameInput = page.locator("#first-name");
        this.lastnameInput = page.locator("#last-name");
        this.postalCodeInput = page.locator("#postal-code");
        this.continueBtn = page.locator("#continue");
    }


    async fillOutFormAndContinue(){
        await expect(this.pageTitleElement).toHaveText("Checkout: Your Information")
        await this.firstnameInput.fill("Tester");
        await this.lastnameInput.fill("Tests");
        await this.postalCodeInput.fill("12345");
        await this.continueBtn.click();
        await expect(this.pageTitleElement).toHaveText("Checkout: Overview");
    }

}