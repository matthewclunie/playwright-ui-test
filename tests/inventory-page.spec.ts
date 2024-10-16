const { test, expect } = require("@playwright/test");

const optionsJSON = require("../Utils/dropdown-info.json");
const optionsData = JSON.parse(JSON.stringify(optionsJSON));

const productsJSON = require("../Utils/product-info.json");
const productsData = JSON.parse(JSON.stringify(productsJSON));

test.only("Check for inventory page content", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  await expect(page.locator(".header_label")).toBeVisible();
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
  await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
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
  const productsCount = await products.count();
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
