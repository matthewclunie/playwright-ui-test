import { expect, Page, test } from "@playwright/test";
import {
  addFullCartLocalStorage,
  checkAddAllItemsToCart,
  getLocalStorageCart,
  goToInventoryPage,
  goToShoppingCart,
} from "../utils/utils";
// import { getFullCartBeforeAll } from "./shared-tests.spec";
import { FullCart } from "../types/global";

let fullCart: FullCart;

const fillOutInfo = async (page: Page) => {
  await page.getByPlaceholder("First Name").fill("Guy");
  await page.getByPlaceholder("Last Name").fill("Testing");
  await page.getByPlaceholder("Zip/Postal Code").fill("55555");
};

const goToFilloutPage = async (page: Page) => {
  await page.goto("https://www.saucedemo.com/checkout-step-one.html");
};

test.beforeAll(async ({ browser }) => {
  //Get localStorage full cart value dynamically
  const context = await browser.newContext();
  const page = await context.newPage();
  await goToInventoryPage(page);
  await checkAddAllItemsToCart(page);
  fullCart = await getLocalStorageCart(page);
});

test("Check fillout page content ", async ({ page }) => {
  //Go to fillout page
  await goToFilloutPage(page);

  //Click Checkout
  await page.locator("#checkout").click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html"
  );

  //Check checkout form Form Page Content
  await expect(page.locator(".title")).toHaveText("Checkout: Your Information");
  await expect(page.getByPlaceholder("First Name")).toBeVisible();
  await expect(page.getByPlaceholder("Last Name")).toBeVisible();
  await expect(page.getByPlaceholder("Zip/Postal Code")).toBeVisible();
  await expect(page.getByRole("button", { name: "cancel" })).toHaveText(
    "Cancel"
  );
  await expect(page.getByRole("button", { name: "continue" })).toHaveText(
    "Continue"
  );
});

test("Check checkout form and checkout navigation functionality", async ({
  page,
}) => {
  //Go to Shopping Cart
  await goToShoppingCart(page);

  //Click Checkout
  await page.locator("#checkout").click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html"
  );

  //Fill out info
  await fillOutInfo(page);

  //Click Continue
  await page.getByRole("button", { name: "continue" }).click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-two.html"
  );

  //Click Cancel
  await page.locator("#cancel").click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html"
  );

  //Click Cancel
  await page.locator("#cancel").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
});

test("Check fillout form errors", async ({ page }) => {
  //Go to fillout page
  await goToFilloutPage(page);

  //Check for first name error
  await page.getByRole("button", { name: "continue" }).click();
  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Error: First Name is required"
  );
  await page.locator(".error-button").click();
  await expect(page.locator(".error-message-container")).not.toBeVisible();

  //Check for last name error
  await page.getByPlaceholder("First Name").fill("Guy");
  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Error: Last Name is required"
  );
  await page.locator(".error-button").click();
  await expect(page.locator(".error-message-container")).not.toBeVisible();

  //Check for zip code error
  await page.getByPlaceholder("Last Name").fill("Testing");
  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Error: Postal Code is required"
  );
  await page.locator(".error-button").click();
  await expect(page.locator(".error-message-container")).not.toBeVisible();
});

test("Check confirmation page content ", async ({ page }) => {
  //Add all items to cart via localStorage beforeAll
  await addFullCartLocalStorage(page, fullCart);

  //Go to Shopping Cart
  await goToShoppingCart(page);

  //Click Checkout
  await page.locator("#checkout").click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html"
  );
});
