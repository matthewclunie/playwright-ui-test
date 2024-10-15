import { Page } from "playwright";

interface LoginData {
  userName: string;
  password: string;
}

const { test, expect } = require("@playwright/test");
const loginJSON = require("../Utils/login-info.json");
const lockedOutJSON = require("../Utils/bad-login-info.json");
const loginData = JSON.parse(JSON.stringify(loginJSON));
const badUserData = JSON.parse(JSON.stringify(lockedOutJSON));

const errorMessageCheck = async (page: Page) => {
  const errorInputIcon = page.locator(".svg-inline--fa");
  await expect(errorInputIcon.first()).toBeVisible();
  await expect(errorInputIcon.nth(1)).toBeVisible();
  const errorButton = page.locator('[data-test="error-button"]');
  await expect(errorButton).toBeVisible();
  await errorButton.click();
  await expect(errorButton).not.toBeVisible();
};

const login = async (page: Page, userName: string, password: string) => {
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder("Username").fill(userName);
  await page.getByPlaceholder("Password").fill(password);
};

test("Check for login page content", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await expect(page.locator(".login_logo")).toHaveText("Swag Labs");
  await expect(page.getByPlaceholder("Username")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  await expect(page.locator("#login_credentials")).toBeVisible();
  await expect(page.locator(".login_password")).toBeVisible();
});

loginData.forEach((data: LoginData) => {
  test(`${data.userName} should log in successfully`, async ({ page }) => {
    await login(page, data.userName, data.password);
    await page.locator("#login-button").click();
    await page.waitForURL("https://www.saucedemo.com/inventory.html");
  });
});

test("incorrect username correct password", async ({ page }) => {
  await login(
    page,
    badUserData.incorrect_userName.userName,
    badUserData.incorrect_userName.password
  );
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(
    badUserData.incorrect_userName.errorMessage
  );
  await errorMessageCheck(page);
});

test("correct username incorrect password", async ({ page }) => {
  const errorInputIcon = page.locator(".svg-inline--fa");
  await login(
    page,
    badUserData.incorrect_password.userName,
    badUserData.incorrect_password.password
  );
  await page.getByRole("button", { name: "Login" }).click();
  await expect(errorInputIcon.first()).toBeVisible();
  await expect(errorInputIcon.nth(1)).toBeVisible();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(
    badUserData.incorrect_userName.errorMessage
  );
  await errorMessageCheck(page);
});

test("error text should appear for locked_out_user", async ({ page }) => {
  const errorInputIcon = page.locator(".svg-inline--fa");
  await login(
    page,
    badUserData.locked_out_user.userName,
    badUserData.locked_out_user.password
  );
  await page.locator("#login-button").click();
  await expect(errorInputIcon.first()).toBeVisible();
  await expect(errorInputIcon.nth(1)).toBeVisible();
  await expect(
    page.getByText(badUserData.locked_out_user.errorMessage)
  ).toHaveText(badUserData.locked_out_user.errorMessage);
  await errorMessageCheck(page);
});
