import { test, expect } from "@playwright/test";
import {
  checkProductDetails,
  checkLocalStorageCart,
  checkEmptyLocalStorageCart,
  goToShoppingCart,
  addPreloadedCart,
  getPreloadedCart,
} from "../utils/utils";
import { FullCart } from "../types/global";

let fullCart: FullCart;

test.beforeAll(async ({ browser }) => {
  fullCart = await getPreloadedCart({ browser });
});

test("Check shopping cart works", async ({ page }) => {
  //Add all items to cart via localStorage beforeAll
  await addPreloadedCart(page, fullCart);

  //Go to Shopping Cart
  await goToShoppingCart(page);

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

  //Check if local storage has correct cart
  await checkLocalStorageCart(page);
});

test("Check if there are no products in cart", async ({ page }) => {
  await goToShoppingCart(page);
  await expect(page.locator(".cart_item")).not.toBeVisible();
  await checkEmptyLocalStorageCart(page);
});
