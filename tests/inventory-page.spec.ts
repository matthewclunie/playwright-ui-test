import exp from "constants";
import { Locator, Page } from "playwright";

const { test, expect } = require("@playwright/test");

interface FooterLink {
  identifier: string;
  url: string;
}

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

test("Check nav bar works", async ({ context, page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#about_sidebar_link").click();
  await expect(page).toHaveURL("https://saucelabs.com/");
  await page.goBack();
  await page.locator("#add-to-cart-sauce-labs-backpack").click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#reset_sidebar_link").click();
  await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
  await page.locator("#react-burger-cross-btn").click();
  await expect(page.locator(".bm-item-list")).not.toBeVisible();
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#inventory_sidebar_link").click();
  await expect(page.locator(".bm-item-list")).not.toBeVisible();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  const loggedInCookies = await context.cookies("https://www.saucedemo.com/");
  await expect(loggedInCookies.length).toBeGreaterThan(0);
  await page.locator("#react-burger-menu-btn").click();
  await page.locator("#logout_sidebar_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/");
  const loggedOutCookies = await context.cookies("https://www.saucedemo.com/");
  await expect(loggedOutCookies.length).toBe(0);
});

test("Check footer", async ({ page }) => {
  const footerText =
    "© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy";

  const footerLinks: FooterLink[] = [
    { identifier: ".social_twitter", url: "https://x.com/saucelabs?mx=2" },
    {
      identifier: ".social_facebook",
      url: "https://www.facebook.com/saucelabs",
    },
    {
      identifier: ".social_linkedin",
      url: "https://www.linkedin.com/company/sauce-labs/",
    },
  ];

  const checkFooterLink = async (
    page: Page,
    identifier: string,
    url: string
  ) => {
    const newTabPromise = page.waitForEvent("popup");
    await page.locator(identifier).click();
    const newTab = await newTabPromise;
    await expect(newTab).toHaveURL(url);
    await newTab.close();
  };

  await page.goto("https://www.saucedemo.com/inventory.html");

  for (const footerLink of footerLinks) {
    await checkFooterLink(page, footerLink.identifier, footerLink.url);
  }

  await expect(page.locator(".footer_copy")).toHaveText(footerText);
});

test("Check sorting tab works", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
  const activeSelector = page.locator(".active_option");
  const dropdownOptions = page.locator(".product_sort_container");
  const productLabels = page.locator(".inventory_item_name ");
  const productPrices = page.locator(".inventory_item_price");

  const getProductLabelTexts = async () => {
    return await productLabels.allInnerTexts();
  };

  const getProductPriceTexts = async () => {
    return await productPrices.allInnerTexts();
  };

  const sortedProductLabels = [...(await getProductLabelTexts())].sort();
  const revSortedProductLabels = [...sortedProductLabels].reverse();

  const sortedPrices = [...(await getProductPriceTexts())].sort((a, b) => {
    const priceA = parseFloat(a.replace("$", ""));
    const priceB = parseFloat(b.replace("$", ""));
    return priceA - priceB;
  });

  const revSortedPrices = [...sortedPrices].reverse();

  const dropdownSelects = [
    {
      value: "az",
      text: "Name (A to Z)",
      getTexts: getProductLabelTexts,
      sortedTexts: sortedProductLabels,
    },
    {
      value: "za",
      text: "Name (Z to A)",
      getTexts: getProductLabelTexts,
      sortedTexts: revSortedProductLabels,
    },
    {
      value: "lohi",
      text: "Price (low to high)",
      getTexts: getProductPriceTexts,
      sortedTexts: sortedPrices,
    },
    {
      value: "hilo",
      text: "Price (high to low)",
      getTexts: getProductPriceTexts,
      sortedTexts: revSortedPrices,
    },
  ];

  for (const select of dropdownSelects) {
    await dropdownOptions.selectOption(select.value);
    await expect(activeSelector).toHaveText(select.text);
    const texts = await select.getTexts();
    await expect(texts).toEqual(select.sortedTexts);
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
