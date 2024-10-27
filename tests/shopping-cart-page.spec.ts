import { test, expect } from "@playwright/test";
import {
  checkAddAllItemsToCart,
  checkClickShoppingCartLink,
  checkProductDetails,
  goToInventoryPage,
} from "../utils/utils";

test("Check shopping cart works", async ({ page }) => {
  await goToInventoryPage(page);

  //Add all items to cart
  await checkAddAllItemsToCart(page);

  //Go to Shopping Cart
  await checkClickShoppingCartLink(page);

  //Check basic shopping cart content
  await expect(page.locator(".title")).toHaveText("Your Cart");
  await expect(page.locator(".cart_quantity_label")).toHaveText("QTY");
  await expect(page.locator(".cart_desc_label")).toHaveText("Description");
  await expect(page.locator("#continue-shopping")).toHaveText(
    "Continue Shopping"
  );
  await expect(page.locator("#checkout")).toHaveText("Checkout");

  //Check accurate quantities for each cart item
  const cartQuantities = page.locator(".cart_quantity");
  const cartQuantitiesCount = await page.locator(".cart_quantity").count();

  for (let i = 0; i < cartQuantitiesCount; i++) {
    const cartQty = cartQuantities.nth(i);
    await expect(cartQty).toHaveText("1");
  }

  //Check shopping cart product content
  const cartItems = page.locator(".cart_item");
  const cartItemsCount = await cartItems.count();

  for (let i = 0; i < cartItemsCount; i++) {
    const cartItem = cartItems.nth(i);
    await checkProductDetails(cartItem, i);
    await expect(cartItem.locator(".cart_button")).toHaveText("Remove");
  }
});
