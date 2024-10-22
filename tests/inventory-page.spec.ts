import { Page } from "playwright";

const { test, expect } = require("@playwright/test");
const { PageObjectsManager } = require("../page-objects/page-objects-manager");

test("Check for inventory page content", async ({ page }) => {
  const poManager = new PageObjectsManager(page);
  const inventoryPage = poManager.getInventoryPage();
  await inventoryPage.goToInventoryPage();
  await inventoryPage.checkBasicPageContent();
  await inventoryPage.checkForDropdownOptions();
  await inventoryPage.checkForProductContent();
});

test("Check add to cart button works", async ({ page }) => {
  const poManager = new PageObjectsManager(page);
  const inventoryPage = poManager.getInventoryPage();
  await inventoryPage.goToInventoryPage();

  await inventoryPage.checkAddingItemsToCart();
  await page.locator(".shopping_cart_link").click();
  await inventoryPage.checkItemsInCart();
  await page.locator("#continue-shopping").click();
  await inventoryPage.checkRemovingItemsFromCart();
});

test("Check product links work", async ({ page }) => {
  const productLinks = page.locator(".inventory_item_name");
  const productLinkCount = await productLinks.count();
  const poManager = new PageObjectsManager(page);
  const inventoryPage = poManager.getInventoryPage();
  await inventoryPage.goToInventoryPage();

  for (let i = 0; i < productLinkCount; i++) {
    const productLink = await productLinks.nth(i);
    await productLink.click();
    await inventoryPage.checkProductPageContent();

    await inventoryPage.addItemFromProductPage();
    await page.locator(".shopping_cart_link").click();
    await inventoryPage.checkProductDetails(page, i);
    await page.goBack();
    await inventoryPage.removeItemFromProductPage();
    await page.locator("#back-to-products").click();
  }
});

test("Check nav bar works", async ({ context, page }) => {
  const poManager = new PageObjectsManager(page);
  const inventoryPage = poManager.getInventoryPage();
  await inventoryPage.goToInventoryPage();
  await inventoryPage.checkAbout();
  await inventoryPage.checkResetState();
  await inventoryPage.checkNavClose();
  await inventoryPage.checkAllItems();
  await inventoryPage.checkLogout(context);
});

test("Check footer", async ({ page }) => {
  const footerText =
    "© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy";

  const poManager = new PageObjectsManager(page);
  const inventoryPage = poManager.getInventoryPage();

  await inventoryPage.goToInventoryPage();
  await inventoryPage.checkFooterLinks();
  await inventoryPage.checkFooterText(footerText);
});

test("Check sorting dropdown works", async ({ page }) => {
  const poManager = new PageObjectsManager(page);
  const inventoryPage = poManager.getInventoryPage();
  await inventoryPage.goToInventoryPage();
  const productLabels = await inventoryPage.getProductLabels();
  const sortedLabels = inventoryPage.getSortedProductLabels(productLabels);
  const revSortedLabels = inventoryPage.getRevSortedProductLabels(sortedLabels);
  const productPrices = await inventoryPage.getProductPrices();
  const sortedPrices = inventoryPage.getSortedPrices(productPrices);
  const revSortedPrices = inventoryPage.getRevSortedPrices();

  const dropdownSelects = [
    {
      value: "az",
      text: "Name (A to Z)",
      getTexts: inventoryPage.getProductLabels,
      sortedTexts: sortedLabels,
    },
    {
      value: "za",
      text: "Name (Z to A)",
      getTexts: inventoryPage.getProductLabels,
      sortedTexts: revSortedLabels,
    },
    {
      value: "lohi",
      text: "Price (low to high)",
      getTexts: inventoryPage.getProductPrices,
      sortedTexts: sortedPrices,
    },
    {
      value: "hilo",
      text: "Price (high to low)",
      getTexts: inventoryPage.getProductPrices,
      sortedTexts: revSortedPrices,
    },
  ];

  await inventoryPage.checkDropdownFunctionality(dropdownSelects);
});

test("Check shopping cart works", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  const poManager = new PageObjectsManager(page);
  const inventoryPage = poManager.getInventoryPage();
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
    await inventoryPage.checkProductDetails(cartItem, i);
    expect(cartItem.locator(".cart_button")).toHaveText("Remove");
  }
});
