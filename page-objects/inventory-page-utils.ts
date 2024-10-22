import { Locator, Page, BrowserContext } from "playwright";
import { expect } from "playwright/test";

const optionsJSON = require("../Utils/dropdown-info.json");
const optionsData = JSON.parse(JSON.stringify(optionsJSON));

const productsJSON = require("../Utils/product-info.json");
const productsData = JSON.parse(JSON.stringify(productsJSON));

const footerJSON = require("../Utils/dropdown-info.json");
const footerData = JSON.parse(JSON.stringify(footerJSON));

interface DropdownSelects {
  value: string;
  text: string;
  getTexts: () => Promise<string[]>;
  sortedTexts: string[];
}

export class InventoryPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToInventoryPage() {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }

  checkProductDetails = async (element: Locator | Page, i: number) => {
    await expect(element.locator(".inventory_item_name")).toHaveText(
      productsData[i].title
    );
    await expect(element.locator(".inventory_item_desc")).toHaveText(
      productsData[i].description
    );
    await expect(element.locator(".inventory_item_price")).toHaveText(
      productsData[i].price
    );
  };

  async checkBasicPageContent() {
    await expect(this.page.locator(".header_label")).toBeVisible();
    await expect(this.page.locator(".shopping_cart_link")).toBeVisible();
    await expect(this.page.locator(".app_logo")).toHaveText("Swag Labs");
    await expect(this.page.locator(".bm-burger-button")).toBeVisible();
    await expect(this.page.locator(".title")).toHaveText("Products");
    await expect(this.page.locator(".product_sort_container")).toBeVisible();
  }

  async checkForDropdownOptions() {
    const options = this.page.locator("option");
    const optionsCount = await options.count();

    for (let i = 0; i < optionsCount; i++) {
      const option = options.nth(i);
      await expect(option).toHaveText(optionsData[i].text);
      await expect(option).toHaveAttribute("value", optionsData[i].value);
    }
    await expect(options).toHaveCount(4);
  }

  async checkForProductContent() {
    const products = this.page.locator(".inventory_item");
    const productsCount = await products.count();

    for (let i = 0; i < productsCount; i++) {
      const product = products.nth(i);
      await this.checkProductDetails(product, i);
      await expect(product.locator("img.inventory_item_img")).toHaveAttribute(
        "src",
        productsData[i].imageSrc
      );
    }
  }

  async checkAddingItemsToCart() {
    const addToCartButtons = this.page.locator(".btn_inventory");
    const addToCartButtonsCount = await addToCartButtons.count();
    const cartBadge = this.page.locator(".shopping_cart_badge");
    let badgeCount = 0;

    await expect(cartBadge).not.toBeVisible();

    for (let i = 0; i < addToCartButtonsCount; i++) {
      const addToCartButton = addToCartButtons.nth(i);
      await expect(addToCartButton).toHaveText("Add to cart");
      await addToCartButton.click();
      badgeCount++;
      await expect(cartBadge).toHaveText(badgeCount.toString());
    }
  }

  async checkItemsInCart() {
    const cartProducts = this.page.locator(".cart_item");
    const cartProductsCount = await cartProducts.count();

    for (let i = 0; i < cartProductsCount; i++) {
      const cartProduct = cartProducts.nth(i);
      await this.checkProductDetails(cartProduct, i);
    }
  }

  async checkRemovingItemsFromCart() {
    const addToCartButtons = this.page.locator(".btn_inventory");
    const addToCartButtonsCount = await addToCartButtons.count();
    const cartBadge = this.page.locator(".shopping_cart_badge");
    let badgeCount = Number(
      await this.page.locator(".shopping_cart_badge").innerText()
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
  }

  async checkProductPageContent(i: number) {
    await expect(this.page).toHaveURL(
      `https://www.saucedemo.com/inventory-item.html?id=${productsData[i].id}`
    );
    await expect(this.page.locator(".inventory_details_name")).toHaveText(
      productsData[i].title
    );
    await expect(this.page.locator(".inventory_details_desc")).toHaveText(
      productsData[i].description
    );
    await expect(this.page.locator(".inventory_details_price")).toHaveText(
      productsData[i].price
    );
    expect(this.page.locator(".inventory_details_img")).toHaveAttribute(
      "src",
      productsData[i].imageSrc
    );
  }

  async addItemFromProductPage() {
    await expect(this.page.locator("#add-to-cart")).toHaveText("Add to cart");
    await this.page.locator("#add-to-cart").click();
    await expect(this.page.locator(".shopping_cart_badge")).toHaveText("1");
    await expect(this.page.locator("#remove")).toHaveText("Remove");
  }

  async removeItemFromProductPage() {
    await this.page.locator("#remove").click();
    await expect(this.page.locator("#add-to-cart")).toHaveText("Add to cart");
    await expect(this.page.locator(".shopping_cart_badge")).not.toBeVisible();
  }

  async checkAbout() {
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#about_sidebar_link").click();
    await expect(this.page).toHaveURL("https://saucelabs.com/");
    await this.page.goBack();
  }

  async checkResetState() {
    await this.page.locator("#add-to-cart-sauce-labs-backpack").click();
    await expect(this.page.locator(".shopping_cart_badge")).toHaveText("1");
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#reset_sidebar_link").click();
    await expect(this.page.locator(".shopping_cart_badge")).not.toBeVisible();
  }

  async checkNavClose() {
    await this.page.locator("#react-burger-cross-btn").click();
    await expect(this.page.locator(".bm-item-list")).not.toBeVisible();
  }

  async checkAllItems() {
    await this.page.locator(".shopping_cart_link").click();
    await expect(this.page).toHaveURL("https://www.saucedemo.com/cart.html");
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#inventory_sidebar_link").click();
    await expect(this.page.locator(".bm-item-list")).not.toBeVisible();
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/inventory.html"
    );
  }
  async checkLogout(context: BrowserContext) {
    const loggedInCookies = await context.cookies("https://www.saucedemo.com/");
    expect(loggedInCookies.length).toBeGreaterThan(0);
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#logout_sidebar_link").click();
    await expect(this.page).toHaveURL("https://www.saucedemo.com/");
    const loggedOutCookies = await context.cookies(
      "https://www.saucedemo.com/"
    );
    expect(loggedOutCookies.length).toBe(0);
  }

  async checkFooterLink(page: Page, identifier: string, url: string) {
    const newTabPromise = page.waitForEvent("popup");
    await page.locator(identifier).click();
    const newTab = await newTabPromise;
    await expect(newTab).toHaveURL(url);
    await newTab.close();
  }

  async checkFooterLinks() {
    for (const footerLink of footerData) {
      await this.checkFooterLink(
        this.page,
        footerLink.identifier,
        footerLink.url
      );
    }
  }

  async checkFooterText(footerText: string) {
    await expect(this.page.locator(".footer_copy")).toHaveText(footerText);
  }

  async getProductLabels() {
    const productLabels = this.page.locator(".inventory_item_name ");
    return await productLabels.allInnerTexts();
  }

  async getProductPrices() {
    const productPrices = this.page.locator(".inventory_item_price");
    return await productPrices.allInnerTexts();
  }

  getSortedProductLabels(productLabels: string[]) {
    return [...productLabels].sort();
  }

  getRevSortedProductLabels(sortedLabels: string[]) {
    return [...sortedLabels].reverse();
  }

  getSortedPrices(productPrices: string[]) {
    return [...productPrices].sort((a, b) => {
      const priceA = parseFloat(a.replace("$", ""));
      const priceB = parseFloat(b.replace("$", ""));
      return priceA - priceB;
    });
  }

  getRevSortedPrices(sortedPrices: number[]) {
    return [...sortedPrices].reverse();
  }

  async checkDropdownFunctionality(dropdownSelects: DropdownSelects[]) {
    const activeSelector = this.page.locator(".active_option");
    const dropdown = this.page.locator(".product_sort_container");

    for (const select of dropdownSelects) {
      await dropdown.selectOption(select.value);
      await expect(activeSelector).toHaveText(select.text);
      const texts = await select.getTexts();
      expect(texts).toEqual(select.sortedTexts);
    }
  }

  async addAllItemsToCart() {
    const addToCartButtons = this.page.locator(".btn_inventory");
    const addToCartButtonsCount = await addToCartButtons.count();
    for (let i = 0; i < addToCartButtonsCount; i++) {
      const addToCartButton = addToCartButtons.nth(i);
      await addToCartButton.click();
    }
    await expect(this.page.locator(".shopping_cart_badge")).toHaveText(
      addToCartButtonsCount.toString()
    );
  }

  async checkClickShoppingCartLink() {
    await this.page.locator(".shopping_cart_link").click();
    await expect(this.page).toHaveURL("https://www.saucedemo.com/cart.html");
  }

  async checkBasicShoppingCartContent() {
    await expect(this.page.locator(".title")).toHaveText("Your Cart");
    await expect(this.page.locator(".cart_quantity_label")).toHaveText("QTY");
    await expect(this.page.locator(".cart_desc_label")).toHaveText(
      "Description"
    );
    await expect(this.page.locator("#continue-shopping")).toHaveText(
      "Continue Shopping"
    );
    await expect(this.page.locator("#checkout")).toHaveText("Checkout");
  }

  async checkShoppingCartQuantities() {
    const cartQuantities = this.page.locator(".cart_quantity");
    const cartQuantitiesCount = await this.page
      .locator(".cart_quantity")
      .count();

    for (let i = 0; i < cartQuantitiesCount; i++) {
      const cartQty = cartQuantities.nth(i);
      await expect(cartQty).toHaveText("1");
    }
  }

  async checkCartItemContent() {
    const cartItems = this.page.locator(".cart_item");
    const cartItemsCount = await cartItems.count();

    for (let i = 0; i < cartItemsCount; i++) {
      const cartItem = cartItems.nth(i);
      await this.checkProductDetails(cartItem, i);
      expect(cartItem.locator(".cart_button")).toHaveText("Remove");
    }
  }
}

module.exports = { InventoryPage };
