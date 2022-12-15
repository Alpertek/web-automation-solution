import { Locator } from "@playwright/test";

export default class WebUtils {

    static async waitSeconds(seconds: number) {
        await new Promise((res, rej) => setTimeout(res, seconds * 1000));
    }
}