import exp from "constants";
import { Locator } from "playwright";

const { test, expect } = require("@playwright/test");

const optionsJSON = require("../Utils/dropdown-info.json");
const optionsData = JSON.parse(JSON.stringify(optionsJSON));

const productsJSON = require("../Utils/product-info.json");
const productsData = JSON.parse(JSON.stringify(productsJSON));

// const checkProductDetails = async (locator: Locator, i: number) => {
//   await expect(locator).toHaveText(productsData[i].title);
//   await expect(locator).toHaveText(productsData[i].description);
//   await expect(locator).toHaveText(productsData[i].price);
// };

test("Check for inventory page content", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  await expect(page.locator(".header_label")).toBeVisible();
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
  await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
  await expect(page.locator(".bm-burger-button")).toBeVisible();
  await expect(page.locator(".title")).toHaveText("Products");
  await expect(page.locator(".product_sort_container")).toBeVisible();

  const options = page.locator("option");
  const optionsCount = await options.count();
  for (let i = 0; i < optionsCount; i++) {
    const option = await options.nth(i);
    await expect(option).toHaveText(optionsData[i].text);
    await expect(option).toHaveAttribute("value", optionsData[i].value);
  }
  await expect(options).toHaveCount(4);

  const products = page.locator(".inventory_item");
  const productsCount = await products.length();

  for (let i = 0; i < productsCount; i++) {
    const product = await products.nth(i);
    await expect(product.locator(".inventory_item_name")).toHaveText(
      productsData[i].title
    );
    await expect(product.locator(".inventory_item_desc")).toHaveText(
      productsData[i].description
    );
    await expect(product.locator(".inventory_item_price")).toHaveText(
      productsData[i].price
    );
    await expect(product.locator("img.inventory_item_img")).toHaveAttribute(
      "src",
      productsData[i].imageSrc
    );
  }
});

test("Check add to cart button works", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  const addToCartButtons = page.locator(".btn_inventory");
  const addToCartButtonsCount = await addToCartButtons.count();
  const cartBadge = page.locator(".shopping_cart_badge");
  let badgeCount = 0;

  expect(cartBadge).not.toBeVisible();

  for (let i = 0; i < addToCartButtonsCount; i++) {
    const addToCartButton = await addToCartButtons.nth(i);
    await expect(addToCartButton).toHaveText("Add to cart");
    await addToCartButton.click();
    badgeCount++;
    await expect(cartBadge).toHaveText(badgeCount.toString());
  }

  await page.locator(".shopping_cart_link").click();

  const cartProducts = page.locator(".cart_item");
  const cartProductsCount = await cartProducts.count();

  for (let i = 0; i < cartProductsCount; i++) {
    const cartProduct = await cartProducts.nth(i);
    expect(cartProduct.locator(".inventory_item_name")).toHaveText(
      productsData[i].title
    );
    expect(cartProduct.locator(".inventory_item_desc")).toHaveText(
      productsData[i].description
    );
    expect(cartProduct.locator(".inventory_item_price")).toHaveText(
      productsData[i].price
    );
  }

  await page.locator("#continue-shopping").click();

  for (let i = 0; i < addToCartButtonsCount; i++) {
    const addToCartButton = await addToCartButtons.nth(i);
    await expect(addToCartButton).toHaveText("Remove");
    await addToCartButton.click();
    badgeCount--;
    if (badgeCount > 0) {
      await expect(cartBadge).toHaveText(badgeCount.toString());
    } else {
      await expect(cartBadge).not.toBeVisible();
    }
    await expect(addToCartButton).toHaveText("Add to cart");
  }
});

test("Check product links work", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  const productLinks = page.locator(".inventory_item_name");
  const productLinkCount = await productLinks.count();

  for (let i = 0; i < productLinkCount; i++) {
    const productLink = await productLinks.nth(i);
    await productLink.click();
    await expect(page).toHaveURL(
      `https://www.saucedemo.com/inventory-item.html?id=${productsData[i].id}`
    );
    await expect(page.locator(".inventory_details_name")).toHaveText(
      productsData[i].title
    );
    await expect(page.locator(".inventory_details_desc")).toHaveText(
      productsData[i].description
    );
    await expect(page.locator(".inventory_details_price")).toHaveText(
      productsData[i].price
    );
    expect(page.locator(".inventory_details_img")).toHaveAttribute(
      "src",
      productsData[i].imageSrc
    );
    await expect(page.locator("#add-to-cart")).toHaveText("Add to cart");
    await page.locator("#add-to-cart").click();
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
    await expect(page.locator("#remove")).toHaveText("Remove");
    await page.locator(".shopping_cart_link").click();

    expect(page.locator(".inventory_item_name")).toHaveText(
      productsData[i].title
    );
    expect(page.locator(".inventory_item_desc")).toHaveText(
      productsData[i].description
    );
    expect(page.locator(".inventory_item_price")).toHaveText(
      productsData[i].price
    );

    await page.goBack();
    await page.locator("#remove").click();
    await expect(page.locator("#add-to-cart")).toHaveText("Add to cart");
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    await page.locator("#back-to-products").click();
  }
});

// test("Check nav bar works", async ({ page }) => {
//   console.log("placeholder");
// });

// test("Check footer links work", async ({ page }) => {
//   console.log("placeholder");
// });

// test("Check add to cart buttons work", async ({ page }) => {
//   console.log("placeholder");
// });

// test("Check sorting tab works", async ({ page }) => {
//   console.log("placeholder");
// });

// test("Check shopping cart works", async ({ page }) => {
//   console.log("placeholder");
// });
