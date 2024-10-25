import { expect, Page, test } from "@playwright/test";
import {
  checkProductDetails,
  checkAddAllItemsToCart,
  checkClickShoppingCartLink,
  goToInventoryPage,
} from "../utils/utils";
import footerJSON from "../data/footer-info.json";
import optionsJSON from "../data/dropdown-info.json";

const optionsData = JSON.parse(JSON.stringify(optionsJSON));
const footerData = JSON.parse(JSON.stringify(footerJSON));

const getProductLabels = async (page: Page) => {
  const productLabels = page.locator(".inventory_item_name ");
  return await productLabels.allInnerTexts();
};

const getProductPrices = async (page: Page) => {
  const productPrices = page.locator(".inventory_item_price");
  return await productPrices.allInnerTexts();
};

test("Check for inventory page content", async ({ page }) => {
  await goToInventoryPage(page);

  //Check Basic Inventory Page Content
  await expect(page.locator(".header_label")).toBeVisible();
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
  await expect(page.locator(".app_logo")).toHaveText("Swag Labs");
  await expect(page.locator(".bm-burger-button")).toBeVisible();
  await expect(page.locator(".title")).toHaveText("Products");
  await expect(page.locator(".product_sort_container")).toBeVisible();

  //checkProductSortOptions
  const options = page.locator("option");
  const optionsCount = await options.count();

  for (let i = 0; i < optionsCount; i++) {
    const option = options.nth(i);
    await expect(option).toHaveText(optionsData[i].text);
    await expect(option).toHaveAttribute("value", optionsData[i].value);
  }
  await expect(options).toHaveCount(4);

  //checkForProductContent -- fix check for product details
  const products = page.locator(".inventory_item");
  const productsCount = await products.count();

  for (let i = 0; i < productsCount; i++) {
    const product = products.nth(i);
    await checkProductDetails(product, i, "img");
  }
});

test("Check add to cart button works", async ({ page }) => {
  await goToInventoryPage(page);

  //checkAddAllItemsToCart
  await checkAddAllItemsToCart(page);

  //checkClickShoppingCartLink
  await checkClickShoppingCartLink(page);

  //checkItemsInCart
  const cartProducts = page.locator(".cart_item");
  const cartProductsCount = await cartProducts.count();

  for (let i = 0; i < cartProductsCount; i++) {
    const cartProduct = cartProducts.nth(i);
    await checkProductDetails(cartProduct, i);
  }

  //checkContinueShoppingClick
  await page.locator("#continue-shopping").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  //checkRemovingItemsFromCart
  const addToCartButtons = page.locator(".btn_inventory");
  const addToCartButtonsCount = await addToCartButtons.count();
  const cartBadge = page.locator(".shopping_cart_badge");
  let badgeCount = Number(
    await page.locator(".shopping_cart_badge").innerText()
  );

  for (let i = 0; i < addToCartButtonsCount; i++) {
    const addToCartButton = addToCartButtons.nth(i);
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

test("Check nav bar works", async ({ context, page }) => {
  await goToInventoryPage(page);

  //checkAboutLink
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#about_sidebar_link").click();
  await expect(page).toHaveURL("https://saucelabs.com/");
  await page.goBack();

  //checkResetStateButton
  await page.locator("#add-to-cart-sauce-labs-backpack").click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#reset_sidebar_link").click();
  await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();

  //checkNavClose
  await page.locator("#react-burger-cross-btn").click();
  await expect(page.locator(".bm-item-list")).not.toBeVisible();

  //checkAllItemsLink
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#inventory_sidebar_link").click();
  await expect(page.locator(".bm-item-list")).not.toBeVisible();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  //checkLogout
  const loggedInCookies = await context.cookies("https://www.saucedemo.com/");
  expect(loggedInCookies.length).toBeGreaterThan(0);
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#logout_sidebar_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/");
  const loggedOutCookies = await context.cookies("https://www.saucedemo.com/");
  expect(loggedOutCookies.length).toBe(0);
});

test("Check footer", async ({ page }) => {
  const footerText =
    "© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy";

  await goToInventoryPage(page);

  //checkFooterLinks
  for (const footerLink of footerData) {
    const newTabPromise = page.waitForEvent("popup");
    await page.locator(footerLink.identifier).click();
    const newTab = await newTabPromise;
    await expect(newTab).toHaveURL(footerLink.url);
    await newTab.close();
  }

  //checkFooterText
  await expect(page.locator(".footer_copy")).toHaveText(footerText);
});

test("Check sorting dropdown works", async ({ page }) => {
  //getProductUtils
  await goToInventoryPage(page);

  //getProductLabels
  const productLabels = await getProductLabels(page);

  //getSortedProductLabels
  const sortedLabels = [...productLabels].sort();

  //getRevSortedProductLabels
  const revSortedLabels = [...sortedLabels].reverse();

  //getProductPrices
  const productPrices = await getProductPrices(page);

  //getSortedPrices
  const sortedPrices = [...productPrices].sort((a, b) => {
    const priceA = parseFloat(a.replace("$", ""));
    const priceB = parseFloat(b.replace("$", ""));
    return priceA - priceB;
  });

  //getRevSortedPrices
  const revSortedPrices = [...sortedLabels].reverse();

  const dropdownSelects = [
    {
      value: "az",
      text: "Name (A to Z)",
      getTexts: async () => await getProductLabels(page),
      sortedTexts: sortedLabels,
    },
    {
      value: "za",
      text: "Name (Z to A)",
      getTexts: async () => await getProductLabels(page),
      sortedTexts: revSortedLabels,
    },
    {
      value: "lohi",
      text: "Price (low to high)",
      getTexts: async () => await getProductLabels(page),
      sortedTexts: sortedPrices,
    },
    {
      value: "hilo",
      text: "Price (high to low)",
      getTexts: async () => await getProductLabels(page),
      sortedTexts: revSortedPrices,
    },
  ];

  //checkProductSort
  const activeSelector = page.locator(".active_option");
  const dropdown = page.locator(".product_sort_container");

  for (const select of dropdownSelects) {
    await dropdown.selectOption(select.value);
    await expect(activeSelector).toHaveText(select.text);
    const texts = await select.getTexts();
    expect(texts).toEqual(select.sortedTexts);
  }
});
