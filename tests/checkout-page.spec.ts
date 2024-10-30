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

interface InputFields {
  page: Page;
  firstName?: string;
  lastName?: string;
  zip?: string;
}

const userInfo = {
  firstName: "Guy",
  lastName: "Testing",
  zip: "55555",
};

const errorMessages = {
  firstName: "Error: First Name is required",
  lastName: "Error: Last Name is required",
  zip: "Error: Postal Code is required",
};

const urls = {
  inventory: "https://www.saucedemo.com/inventory.html",
  checkoutStepOne: "https://www.saucedemo.com/checkout-step-one.html",
  checkoutStepTwo: "https://www.saucedemo.com/checkout-step-two.html",
  shoppingCart: "https://www.saucedemo.com/cart.html",
};

const fillOutInfo = async ({ page, firstName, lastName, zip }: InputFields) => {
  if (firstName) {
    await page.getByPlaceholder("First Name").fill(firstName);
  }
  if (lastName) {
    await page.getByPlaceholder("Last Name").fill(lastName);
  }
  if (zip) {
    await page.getByPlaceholder("Zip/Postal Code").fill(zip);
  }
};

const submitForm = async (page: Page) => {
  await page.getByRole("button", { name: "continue" }).click();
};

const goToFilloutPage = async (page: Page) => {
  await page.goto(urls.checkoutStepOne);
};

const checkErrorIcons = async (page: Page) => {
  const errorIcon = page.locator(".error_icon");

  await expect(errorIcon.first()).toBeVisible();
  await expect(errorIcon.nth(1)).toBeVisible();
  await expect(errorIcon.nth(2)).toBeVisible();
};

const checkErrorMessage = async (page: Page, errorMessage: string) => {
  const errorBanner = page.locator('[data-test="error"]');
  await expect(errorBanner).toHaveText(errorMessage);
  await page.locator(".error-button").click();
  await expect(errorBanner).not.toBeVisible();
};

const clickCheckout = async (page: Page) => {
  await page.locator("#checkout").click();
  await expect(page).toHaveURL(urls.checkoutStepOne);
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
  await clickCheckout(page);

  //Fill out info
  await fillOutInfo({
    page,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    zip: userInfo.zip,
  });

  //Click Continue
  await page.getByRole("button", { name: "continue" }).click();
  await expect(page).toHaveURL(urls.checkoutStepTwo);

  //Click Cancel
  await page.locator("#cancel").click();
  await expect(page).toHaveURL(urls.inventory);

  //Go to Checkout Form
  await goToFilloutPage(page);

  //Click Cancel
  await page.locator("#cancel").click();
  await expect(page).toHaveURL(urls.shoppingCart);
});

test("Check fillout form errors", async ({ page }) => {
  //Go to fillout page
  await goToFilloutPage(page);

  //Check for first name error
  await submitForm(page);
  await checkErrorIcons(page);
  await checkErrorMessage(page, errorMessages.firstName);

  //Check for last name error
  await fillOutInfo({ page, firstName: userInfo.firstName });
  await submitForm(page);
  await checkErrorIcons(page);
  await checkErrorMessage(page, errorMessages.lastName);

  //Check for zip code error
  await fillOutInfo({ page, lastName: userInfo.lastName });
  await submitForm(page);
  await checkErrorIcons(page);
  await checkErrorMessage(page, errorMessages.zip);
});

test("Check confirmation page content", async ({ page }) => {
  //Add all items to cart via localStorage beforeAll
  await addFullCartLocalStorage(page, fullCart);

  //Go to Shopping Cart
  await goToShoppingCart(page);

  //Click Checkout
  await page.locator("#checkout").click();
  await expect(page).toHaveURL(urls.checkoutStepOne);
});
