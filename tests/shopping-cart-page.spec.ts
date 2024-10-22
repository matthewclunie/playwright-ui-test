import { Locator, Page } from "playwright";

const { test, expect } = require("@playwright/test");

const productsJSON = require("../Utils/product-info.json");
const productsData = JSON.parse(JSON.stringify(productsJSON));

test("Check for shopping cart content", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  const addToCartButtons = page.locator(".btn_inventory");
  const addToCartButtonsCount = await addToCartButtons.count();
  for (let i = 0; i < addToCartButtonsCount; i++) {
    const addToCartButton = await addToCartButtons.nth(i);
    await addToCartButton.click();
  }
  await expect(page.locator(".shopping_cart_badge")).toHaveText("6");
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  await expect(page.locator(".title")).toHaveText("Your Cart");
  await expect(".cart_quantity_label").toHaveText("QTY");
  await expect(".cart_desc_label").toHaveText("Description");
  await expect(page.locator("#continue-shopping")).toHaveText(
    "Continue Shopping"
  );
  await expect(page.locator(".checkout")).toHaveText("Checkout");
  const cartQuantities = page.locator(".cart_quantity");
  const cartQuantitiesCount = await page.locator(".cart_quantity").count();

  for (let i = 0; i < cartQuantitiesCount; i++) {
    const cartQty = await cartQuantities.nth(i);
    await expect(cartQty).toHaveText("1");
  }
  const cartItems = page.locator(".cart_item");
  const cartItemsCount = await cartItems.count();

  for (let i = 0; i < cartItemsCount; i++) {
    const cartItem = await cartItems.nth(i);
    expect(cartItem.locator(".inventory_item_name")).toHaveText(
      productsData[i].title
    );
    expect(cartItem.locator(".inventory_item_desc")).toHaveText(
      productsData[i].description
    );
    expect(cartItem.locator(".inventory_item_price")).toHaveText(
      productsData[i].price
    );
    expect(cartItem.locator(".cart_button")).toHaveText("Remove");
  }
});

test("Check shopping cart works", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  const addToCartButtons = page.locator(".btn_inventory");
  const addToCartButtonsCount = await addToCartButtons.count();
  for (let i = 0; i < addToCartButtonsCount; i++) {
    const addToCartButton = await addToCartButtons.nth(i);
    await addToCartButton.click();
  }
  await expect(page.locator(".shopping_cart_badge")).toHaveText("6");
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
});
