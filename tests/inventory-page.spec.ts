import { Page } from "playwright";

const { test, expect } = require("@playwright/test");

const login = async (page: Page, userName: string, password: string) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder("Username").fill(userName);
  await page.getByPlaceholder("Password").fill(password);
};

test("Check for inventory page content", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await page.goto("https://www.saucedemo.com/inventory.html");
  await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
});
