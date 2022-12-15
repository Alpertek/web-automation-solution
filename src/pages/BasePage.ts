import { Locator, Page } from "@playwright/test";
import * as dotenv from "dotenv" 
import Product from "../utils/Product";

dotenv.config();

export default class BasePage{

    protected readonly standardUser = process.env.STANDARD_USER;
    protected readonly lockedUser = process.env.LOCKED_USER;    
    protected readonly page : Page;    
    protected readonly pageTitleElement : Locator;
    protected static selectedProductList: Product[] = [];
    protected static productsInCart: Product[] = [];
    protected static productToRemove: Product;

    constructor(page: Page){
        this.page = page;        
        this.pageTitleElement = page.locator("span.title");
    }

    async extractProductPrice(element : Locator, index:number){        
        return await element.evaluate((el, i)=>{
            return Number.parseFloat(el.childNodes[i].textContent);
        }, index)
    }
        
}