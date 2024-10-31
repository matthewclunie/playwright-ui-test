import { test as setup } from "@playwright/test";
import path from "path";
import { urls } from "../data/urls";

const authFile = path.join(__dirname, "../.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto(urls.login);
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(urls.inventory);
  await page.context().storageState({ path: authFile });
});
