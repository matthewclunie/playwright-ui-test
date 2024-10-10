const { test, expect } = require("@playwright/test");

const password = "secret_sauce";

test("Check for login page content", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await expect(page.locator(".login_logo")).toHaveText("Swag Labs");
  await expect(page.getByPlaceholder("Username")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  await expect(page.locator("#login_credentials")).toBeVisible();
  await expect(page.locator(".login_password")).toBeVisible();
});

test("standard_user should log in successfully", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill(password);
  await page.locator("#login-button").click();
  await page.waitForURL("https://www.saucedemo.com/inventory.html");
});

test("error text should appear for locked_out_user", async ({ page }) => {
  const errorMessage = "Epic sadface: Sorry, this user has been locked out.";

  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder("Username").fill("locked_out_user");
  await page.getByPlaceholder("Password").fill(password);
  await page.locator("#login-button").click();
  await expect(page.getByText(errorMessage)).toHaveText(errorMessage);
});

test("error text should appear for locked_out_user", async ({ page }) => {
  const errorMessage = "Epic sadface: Sorry, this user has been locked out.";

  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder("Username").fill("locked_out_user");
  await page.getByPlaceholder("Password").fill(password);
  await page.locator("#login-button").click();
  await expect(page.getByText(errorMessage)).toHaveText(errorMessage);
});

// Git
// Expect everything on login page. Put in auth for now?
// Make an array for titles, descriptions, etc. loop through and make sure everything has what it needs
