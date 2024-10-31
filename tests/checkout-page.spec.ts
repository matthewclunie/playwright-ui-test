import { expect, Page, test } from "@playwright/test";
import {
  addPreloadedCart,
  checkProductDetails,
  getPreloadedCart,
  goToShoppingCart,
} from "../utils/utils";
import { FullCart } from "../types/global";
import { urls } from "../data/urls";

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
  fullCart = await getPreloadedCart({ browser });
});

test("Check fillout page content ", async ({ page }) => {
  //Go to fillout page
  await goToFilloutPage(page);

  //Check checkout form page content
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
  //Go to shopping cart
  await goToShoppingCart(page);

  //Click checkout
  await clickCheckout(page);

  //Fill out info
  await fillOutInfo({
    page,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    zip: userInfo.zip,
  });

  //Click continue
  await page.getByRole("button", { name: "continue" }).click();
  await expect(page).toHaveURL(urls.checkoutStepTwo);

  //Click cancel
  await page.locator("#cancel").click();
  await expect(page).toHaveURL(urls.inventory);

  //Go to checkout Form
  await goToFilloutPage(page);

  //Click cancel
  await page.locator("#cancel").click();
  await expect(page).toHaveURL(urls.cart);
});

test("Check form errors", async ({ page }) => {
  const errorMessages = {
    firstName: "Error: First Name is required",
    lastName: "Error: Last Name is required",
    zip: "Error: Postal Code is required",
  };

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
  await addPreloadedCart(page, fullCart);

  //Go to shopping cart
  await goToShoppingCart(page);

  //Click checkout
  await clickCheckout(page);

  //Fill out info
  await fillOutInfo({
    page,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    zip: userInfo.zip,
  });

  //Continue
  await page.getByRole("button", { name: "continue" }).click();

  //Check basic checkout page content
  const summaryInfoTexts = [
    "Payment Information:",
    "Shipping Information:",
    "Price Total",
  ];
  const summaryValueTexts = ["SauceCard #31337", "Free Pony Express Delivery!"];

  const summaryInfoLabels = page.locator(".summary_info_label");
  const summaryValueLabels = page.locator(".summary_value_label");

  await expect(page.locator(".title")).toHaveText("Checkout: Overview");
  await expect(page.locator(".cart_quantity_label")).toHaveText("QTY");
  await expect(page.locator(".cart_desc_label")).toHaveText("Description");

  for (let i = 0; i < summaryInfoTexts.length; i++) {
    const summaryInfoLabel = summaryInfoLabels.nth(i);
    await expect(summaryInfoLabel).toHaveText(summaryInfoTexts[i]);
  }

  for (let i = 0; i < summaryValueTexts.length; i++) {
    const summaryValueLabel = summaryValueLabels.nth(i);
    await expect(summaryValueLabel).toHaveText(summaryValueTexts[i]);
  }

  //Check product content
  const cartItems = page.locator(".cart_item");
  const cartItemsCount = await cartItems.count();

  for (let i = 0; i < cartItemsCount; i++) {
    const cartItem = cartItems.nth(i);
    const cartQuantity = page.locator(".cart_quantity").nth(i);
    await checkProductDetails(cartItem, i);
    await expect(cartQuantity).toHaveText("1");
  }

  //Calculate order summary
  const priceTexts = await page
    .locator(".inventory_item_price")
    .allInnerTexts();

  const getSubTotal = (priceTexts: string[]) => {
    let subTotal = 0;

    for (let i = 0; i < priceTexts.length; i++) {
      const price = parseFloat(priceTexts[i].replace("$", ""));
      subTotal = subTotal + price;
    }
    return subTotal.toFixed(2);
  };

  const subTotal = getSubTotal(priceTexts);
  const tax = (Number(subTotal) * 0.08).toFixed(2);
  const total = (Number(subTotal) + Number(tax)).toFixed(2);

  //Check order summary
  await expect(page.locator(".summary_subtotal_label")).toHaveText(
    `Item total: $${subTotal}`
  );

  await expect(page.locator(".summary_tax_label")).toHaveText(`Tax: $${tax}`);
  await expect(page.locator(".summary_total_label")).toHaveText(
    `Total: $${total}`
  );

  await expect(page.getByRole("button", { name: "cancel" })).toHaveText(
    "Cancel"
  );
  await expect(page.getByRole("button", { name: "finish" })).toHaveText(
    "Finish"
  );
});

test("Check completed checkout content", async ({ page }) => {
  //Add all items to cart via localStorage beforeAll
  await addPreloadedCart(page, fullCart);

  //Go to shopping cart
  await goToShoppingCart(page);

  //Click checkout
  await clickCheckout(page);

  //Fill out info
  await fillOutInfo({
    page,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    zip: userInfo.zip,
  });

  //Continue
  await page.getByRole("button", { name: "continue" }).click();

  //Click finish
  await page.getByRole("button", { name: "finish" }).click();

  //Check completed checkout content
  const orderConfirmation = {
    title: "Checkout: Complete!",
    header: "Thank you for your order!",
    text: "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
  };

  await expect(page.locator(".title")).toHaveText(orderConfirmation.title);
  await expect(page.locator(".pony_express")).toBeVisible();
  await expect(page.locator(".complete-header")).toHaveText(
    orderConfirmation.header
  );
  await expect(page.locator(".complete-text")).toHaveText(
    orderConfirmation.text
  );
  const homeButton = page.getByRole("button", { name: "Back Home" });
  await expect(homeButton).toHaveText("Back Home");

  //Check navigate home
  await homeButton.click();
  await expect(page).toHaveURL(urls.inventory);
});
