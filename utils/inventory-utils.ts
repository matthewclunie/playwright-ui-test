import { Page } from "playwright";
import { expect } from "playwright/test";

export class InventoryUtils {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToInventoryPage() {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }

  async checkInventoryUtilsContent() {
    await expect(this.page.locator(".header_label")).toBeVisible();
    await expect(this.page.locator(".shopping_cart_link")).toBeVisible();
    await expect(this.page.locator(".app_logo")).toHaveText("Swag Labs");
    await expect(this.page.locator(".bm-burger-button")).toBeVisible();
    await expect(this.page.locator(".title")).toHaveText("Products");
    await expect(this.page.locator(".product_sort_container")).toBeVisible();
  }
}

module.exports = { InventoryUtils };
