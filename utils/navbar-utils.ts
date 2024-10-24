import { Page, BrowserContext } from "playwright";
import { expect } from "playwright/test";

export class NavBarUtils {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkAboutLink() {
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#about_sidebar_link").click();
    await expect(this.page).toHaveURL("https://saucelabs.com/");
    await this.page.goBack();
  }

  async checkResetStateButton() {
    await this.page.locator("#add-to-cart-sauce-labs-backpack").click();
    await expect(this.page.locator(".shopping_cart_badge")).toHaveText("1");
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#reset_sidebar_link").click();
    await expect(this.page.locator(".shopping_cart_badge")).not.toBeVisible();
  }

  async checkNavClose() {
    await this.page.locator("#react-burger-cross-btn").click();
    await expect(this.page.locator(".bm-item-list")).not.toBeVisible();
  }

  async checkAllItemsLink() {
    await this.page.locator(".shopping_cart_link").click();
    await expect(this.page).toHaveURL("https://www.saucedemo.com/cart.html");
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#inventory_sidebar_link").click();
    await expect(this.page.locator(".bm-item-list")).not.toBeVisible();
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/inventory.html"
    );
  }
  async checkLogout(context: BrowserContext) {
    const loggedInCookies = await context.cookies("https://www.saucedemo.com/");
    expect(loggedInCookies.length).toBeGreaterThan(0);
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#logout_sidebar_link").click();
    await expect(this.page).toHaveURL("https://www.saucedemo.com/");
    const loggedOutCookies = await context.cookies(
      "https://www.saucedemo.com/"
    );
    expect(loggedOutCookies.length).toBe(0);
  }
}

module.exports = { NavBarUtils };
