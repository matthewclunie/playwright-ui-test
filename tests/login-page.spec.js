const { test, expect } = require("@playwright/test");
const loginJSON = require("../Utils/login-info.json");
const lockedOutJSON = require("../Utils/bad-login-info.json");
const loginData = JSON.parse(JSON.stringify(loginJSON));
const badUserData = JSON.parse(JSON.stringify(lockedOutJSON));

const errorMessageCheck = async (page) => {
  await expect(page.locator(".svg-inline--fa").first()).toBeVisible();
  await expect(page.locator(".svg-inline--fa").nth(1)).toBeVisible();
  const errorButton = page.locator('[data-test="error-button"]');
  await expect(errorButton).toBeVisible();
  await errorButton.click();
  await expect(errorButton).not.toBeVisible();
};

const login = async (userName, password) => {
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

loginData.forEach((data) => {
  test(`${data.userName} should log in successfully`, async ({ page }) => {
    await login(data.userName, data.password);
    await page.locator("#login-button").click();
    await page.waitForURL("https://www.saucedemo.com/inventory.html");
  });
});

test("incorrect username correct password", async ({ page }) => {
  await login(
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
  await login(
    badUserData.incorrect_password.userName,
    badUserData.incorrect_password.password
  );
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.locator("/svg-inline--fa").first()).toBeVisible();
  await expect(page.locator("/svg-inline--fa").nth(1)).toBeVisible();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(
    badUserData.incorrect_userName.errorMessage
  );
  await errorMessageCheck(page);
});

test("error text should appear for locked_out_user", async ({ page }) => {
  await login(
    badUserData.locked_out_user.userName,
    badUserData.locked_out_user.password
  );
  await page.locator("#login-button").click();
  await expect(page.locator("/svg-inline--fa").first()).toBeVisible();
  await expect(page.locator("/svg-inline--fa").nth(1)).toBeVisible();
  await expect(page.getByText(errorMessage)).toHaveText(
    lockedOutUserData.errorMessage
  );
  await errorMessageCheck(page);
});
