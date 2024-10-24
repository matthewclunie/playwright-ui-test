import { Page } from "playwright";
import { expect } from "playwright/test";
import { UtilManager } from "./util-manager";

export class ShoppingCartUtils {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkAddItemsToCart() {
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
    const utilManager = new UtilManager(this.page);
    const productUtils = utilManager.getProductUtils();
    const cartProducts = this.page.locator(".cart_item");
    const cartProductsCount = await cartProducts.count();

    for (let i = 0; i < cartProductsCount; i++) {
      const cartProduct = cartProducts.nth(i);
      await productUtils.checkProductDetails(cartProduct, i);
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

  async checkContinueShoppingClick() {
    await this.page.locator("#continue-shopping").click();
    await expect(this.page).toHaveURL(
      "https://www.saucedemo.com/inventory.html"
    );
  }

  async checkCartItemsContent() {
    const utilManager = new UtilManager(this.page);
    const productUtils = utilManager.getProductUtils();
    const cartItems = this.page.locator(".cart_item");
    const cartItemsCount = await cartItems.count();

    for (let i = 0; i < cartItemsCount; i++) {
      const cartItem = cartItems.nth(i);
      await productUtils.checkProductDetails(cartItem, i);
      expect(cartItem.locator(".cart_button")).toHaveText("Remove");
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
}

module.exports = { ShoppingCartUtils };
