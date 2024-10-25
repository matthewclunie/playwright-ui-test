import { expect, Locator, Page } from "playwright/test";
import productsJSON from "../data/product-info.json";
const productsData = JSON.parse(JSON.stringify(productsJSON));

export const checkProductDetails = async (
  element: Locator | Page,
  i: number,
  src?: string
) => {
  await expect(element.locator(".inventory_item_name")).toHaveText(
    productsData[i].title
  );
  await expect(element.locator(".inventory_item_desc")).toHaveText(
    productsData[i].description
  );
  await expect(element.locator(".inventory_item_price")).toHaveText(
    productsData[i].price
  );
  if (src) {
    await expect(element.locator("img.inventory_item_img")).toHaveAttribute(
      "src",
      productsData[i].imageSrc
    );
  }
};

export const checkAddAllItemsToCart = async (page: Page) => {
  const addToCartButtons = page.locator(".btn_inventory");
  const addToCartButtonsCount = await addToCartButtons.count();
  const cartBadge = page.locator(".shopping_cart_badge");
  let badgeCount = 0;

  await expect(cartBadge).not.toBeVisible();

  for (let i = 0; i < addToCartButtonsCount; i++) {
    const addToCartButton = addToCartButtons.nth(i);
    await expect(addToCartButton).toHaveText("Add to cart");
    await addToCartButton.click();
    badgeCount++;
    await expect(cartBadge).toHaveText(badgeCount.toString());
  }
};

export const checkClickShoppingCartLink = async (page: Page) => {
  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
};

export const goToInventoryPage = async (page: Page) => {
  await page.goto("https://www.saucedemo.com/inventory.html");
};
