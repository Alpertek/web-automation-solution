import { expect, Locator, Page } from "@playwright/test";
import * as dotenv from "dotenv" 
import BasePage from "./BasePage";

dotenv.config();

export default class LoginPage extends BasePage {

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginBtn: Locator;      

    constructor(page: Page) {
        super(page)
        this.usernameInput = page.locator("input#user-name");
        this.passwordInput = page.locator("input#password");
        this.loginBtn = page.locator("#login-button");        
    }

    async load() {
        await this.page.goto("/");
        expect(this.page.url()).toContain(process.env.URL);
    }

    private async login(username: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(process.env.PASSWORD);
        await this.loginBtn.click();
    }

    async loginAsStandardUser() {
        await this.login(this.standardUser);
    }

    async tryLoginAsLockedUser() {
        await this.login(this.lockedUser);
    }

    async verifyLoginSuccessful() {        
        await expect(this.usernameInput, {message : "User couldn't login, login failed. Check page for additional error messages"}).toHaveCount(0, {timeout : 2000});                
        await expect(this.page.locator("span.title")).toHaveText("Products");
    }

}