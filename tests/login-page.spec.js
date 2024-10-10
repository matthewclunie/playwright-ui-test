const { test, expect } = require("@playwright/test");

// test("Has title", async ({ page }) => {
//   await page.goto("https://www.saucedemo.com/");
//   await expect(page).toHaveTitle(/Swag Labs/);
// });

// test("Has title", async ({ page }) => {
//   await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
//   console.log("YO");
// });

test("Has other thing", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  await expect(
    page
      .locator(".inventory_item_label")
      .first()
      .locator(".inventory_item_name ")
  ).toHaveText("Sauce Labs Backpack");
});

// Git
// Expect everything on login page. Put in auth for now?
// Make an array for titles, descriptions, etc. loop through and make sure everything has what it needs
