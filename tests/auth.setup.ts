import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, ".auth/user.json");

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("https://www.saucedemo.com/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("https://www.saucedemo.com/inventory.html");
  //   Alternatively, you can wait until the page reaches a state where all cookies are set.
  //   await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
