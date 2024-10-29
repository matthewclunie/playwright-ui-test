import { expect, Locator, Page } from "playwright/test";
import productsJSON from "../data/product-info.json";
import { FullCart } from "../types/global";
const productsData: ProductInfo[] = JSON.parse(JSON.stringify(productsJSON));

export interface ProductInfo {
  id: number;
  title: string;
  description: string;
  price: string;
  imageSrc: string;
}

export const checkProductDetails = async (
  element: Locator | Page,
  i: number,
  imgIdentifier?: string
) => {
  await expect(element.locator('[data-test="inventory-item-name"]')).toHaveText(
    productsData[i].title
  );
  await expect(element.locator('[data-test="inventory-item-desc"]')).toHaveText(
    productsData[i].description
  );
  await expect(
    element.locator('[data-test="inventory-item-price"]')
  ).toHaveText(productsData[i].price);
  if (imgIdentifier) {
    await expect(element.locator(imgIdentifier)).toHaveAttribute(
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

export const getLocalStorageCart = async (page: Page) => {
  return await page.evaluate(async () => {
    const localStorageCart = localStorage.getItem("cart-contents");

    if (localStorageCart) {
      return await JSON.parse(localStorageCart);
    } else {
      console.error("Error parsing JSON");
      return null;
    }
  });
};

export const getItemIds = (productData: ProductInfo[]) => {
  const ids: number[] = [];

  for (let i = 0; i < productData.length; i++) {
    ids.push(productData[i].id);
  }
  return ids;
};

export const checkLocalStorageCart = async (page: Page) => {
  const localStorageCart = await getLocalStorageCart(page);
  const productIds = getItemIds(productsData);
  expect(localStorageCart).toEqual(productIds);
};

export const checkEmptyLocalStorageCart = async (page: Page) => {
  const localStorageCart = await getLocalStorageCart(page);
  expect(localStorageCart).toBeFalsy();
};

export const goToShoppingCart = async (page: Page) => {
  await page.goto("https://www.saucedemo.com/cart.html");
};

export const addFullCartLocalStorage = async (
  page: Page,
  fullCart: FullCart
) => {
  page.addInitScript((value: string) => {
    localStorage.setItem("cart-contents", value);
  }, JSON.stringify(fullCart));
};
