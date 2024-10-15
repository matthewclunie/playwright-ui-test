import { Page } from "playwright";

const { test, expect } = require("@playwright/test");

test("Check for inventory page content", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
});
