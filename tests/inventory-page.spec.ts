import { test } from "@playwright/test";
import { UtilManager } from "../utils/util-manager";

test("Check for inventory page content", async ({ page }) => {
  const utilManager = new UtilManager(page);
  const inventoryUtils = utilManager.getInventoryUtils();
  const productUtils = utilManager.getProductUtils();
  await inventoryUtils.goToInventoryPage();
  await inventoryUtils.checkInventoryUtilsContent();
  await productUtils.checkProductSortOptions();
  await productUtils.checkForProductContent();
});

test("Check add to cart button works", async ({ page }) => {
  const utilManager = new UtilManager(page);
  const inventoryUtils = utilManager.getInventoryUtils();
  const shoppingCartUtils = utilManager.getShoppingCartUtils();

  await inventoryUtils.goToInventoryPage();
  await shoppingCartUtils.checkAddItemsToCart();
  await shoppingCartUtils.checkClickShoppingCartLink();
  await shoppingCartUtils.checkItemsInCart();
  await shoppingCartUtils.checkContinueShoppingClick();
  await shoppingCartUtils.checkRemovingItemsFromCart();
});

test("Check nav bar works", async ({ context, page }) => {
  const utilManager = new UtilManager(page);
  const inventoryUtils = utilManager.getInventoryUtils();
  const navBarUtils = utilManager.getNavBarUtils();

  await inventoryUtils.goToInventoryPage();
  await navBarUtils.checkAboutLink();
  await navBarUtils.checkResetStateButton();
  await navBarUtils.checkNavClose();
  await navBarUtils.checkAllItemsLink();
  await navBarUtils.checkLogout(context);
});

test("Check footer", async ({ page }) => {
  const footerText =
    "© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy";

  const utilManager = new UtilManager(page);
  const inventoryUtils = utilManager.getInventoryUtils();
  const footerUtils = utilManager.getFooterUtils();

  await inventoryUtils.goToInventoryPage();
  await footerUtils.checkFooterLinks();
  await footerUtils.checkFooterText(footerText);
});

test("Check sorting dropdown works", async ({ page }) => {
  const utilManager = new UtilManager(page);
  const inventoryUtils = utilManager.getInventoryUtils();
  const productUtils = utilManager.getProductUtils();
  await inventoryUtils.goToInventoryPage();
  const productLabels = await productUtils.getProductLabels();
  const sortedLabels = productUtils.getSortedProductLabels(productLabels);
  const revSortedLabels = productUtils.getRevSortedProductLabels(sortedLabels);
  const productPrices = await productUtils.getProductPrices();
  const sortedPrices = productUtils.getSortedPrices(productPrices);
  const revSortedPrices = productUtils.getRevSortedPrices(sortedPrices);

  const dropdownSelects = [
    {
      value: "az",
      text: "Name (A to Z)",
      getTexts: async () => await productUtils.getProductLabels(),
      sortedTexts: sortedLabels,
    },
    {
      value: "za",
      text: "Name (Z to A)",
      getTexts: async () => await productUtils.getProductLabels(),
      sortedTexts: revSortedLabels,
    },
    {
      value: "lohi",
      text: "Price (low to high)",
      getTexts: async () => await productUtils.getProductPrices(),
      sortedTexts: sortedPrices,
    },
    {
      value: "hilo",
      text: "Price (high to low)",
      getTexts: async () => await productUtils.getProductPrices(),
      sortedTexts: revSortedPrices,
    },
  ];

  await productUtils.checkProductSort(dropdownSelects);
});
