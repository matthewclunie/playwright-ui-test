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
  const revSortedPrices = inventoryPage.getRevSortedPrices(sortedPrices);

  const dropdownSelects = [
    {
      value: "az",
      text: "Name (A to Z)",
      getTexts: async () => await inventoryPage.getProductLabels(),
      sortedTexts: sortedLabels,
    },
    {
      value: "za",
      text: "Name (Z to A)",
      getTexts: async () => await inventoryPage.getProductLabels(),
      sortedTexts: revSortedLabels,
    },
    {
      value: "lohi",
      text: "Price (low to high)",
      getTexts: async () => await inventoryPage.getProductPrices(),
      sortedTexts: sortedPrices,
    },
    {
      value: "hilo",
      text: "Price (high to low)",
      getTexts: async () => await inventoryPage.getProductPrices(),
      sortedTexts: revSortedPrices,
    },
  ];

  await inventoryPage.checkDropdownFunctionality(dropdownSelects);
});

test("Check shopping cart works", async ({ page }) => {
  const poManager = new PageObjectsManager(page);
  const inventoryPage = poManager.getInventoryPage();
  await inventoryPage.goToInventoryPage();
  await inventoryPage.addAllItemsToCart();
  await inventoryPage.checkClickShoppingCartLink();
  await inventoryPage.checkBasicShoppingCartContent();
  await inventoryPage.checkShoppingCartQuantities();
  await inventoryPage.checkCartItemContent();
});
