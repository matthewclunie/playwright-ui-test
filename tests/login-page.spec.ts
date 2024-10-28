import { Page } from "playwright";
import { test, expect } from "@playwright/test";
import loginJSON from "../data/login-info.json";
import lockedOutJSON from "../data/bad-login-info.json";

interface LoginData {
  userName: string;
  password: string;
}

interface BadUser {
  userName: string;
  password: string;
  errorMessage: string;
}
interface BadUserData {
  locked_out_user: BadUser;
  incorrect_userName: BadUser;
  incorrect_password: BadUser;
}

const loginData: LoginData[] = JSON.parse(JSON.stringify(loginJSON));
const badUserData: BadUserData = JSON.parse(JSON.stringify(lockedOutJSON));

const errorMessageCheck = async (page: Page, expectedError: string) => {
  const errorInputIcon = page.locator(".error_icon");
  await expect(errorInputIcon.first()).toBeVisible();
  await expect(errorInputIcon.nth(1)).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText(expectedError);
  const errorCloseButton = page.locator('[data-test="error-button"]');
  await expect(errorCloseButton).toBeVisible();
  await errorCloseButton.click();
  await expect(errorCloseButton).not.toBeVisible();
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
  await errorMessageCheck(page, badUserData.incorrect_userName.errorMessage);
});

test("correct username incorrect password", async ({ page }) => {
  await login(
    page,
    badUserData.incorrect_password.userName,
    badUserData.incorrect_password.password
  );
  await page.getByRole("button", { name: "Login" }).click();
  await errorMessageCheck(page, badUserData.incorrect_userName.errorMessage);
});

test("error text should appear for locked_out_user", async ({ page }) => {
  await login(
    page,
    badUserData.locked_out_user.userName,
    badUserData.locked_out_user.password
  );
  await page.locator("#login-button").click();
  await errorMessageCheck(page, badUserData.locked_out_user.errorMessage);
});
