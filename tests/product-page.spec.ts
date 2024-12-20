import { expect, test } from "@playwright/test";
import productsJSON from "../data/product-info.json";
import {
  checkClickShoppingCartLink,
  checkEmptyLocalStorageCart,
  checkProductDetails,
  getLocalStorageCart,
  goToInventoryPage,
} from "../utils/utils";
import { urls } from "../data/urls";
const productsData = JSON.parse(JSON.stringify(productsJSON));

test("Check product links work", async ({ page }) => {
  await goToInventoryPage(page);
  const productLinks = page.locator(".inventory_item_name");
  const productLinkCount = await productLinks.count();

  for (let i = 0; i < productLinkCount; i++) {
    const productLink = productLinks.nth(i);
    await productLink.click();

    //Check product page content
    await expect(page).toHaveURL(
      `${urls.inventoryItem}?id=${productsData[i].id}`
    );
    await checkProductDetails(page, i, ".inventory_details_img");

    //Add item from product page
    await expect(page.locator("#add-to-cart")).toHaveText("Add to cart");
    await page.locator("#add-to-cart").click();
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
    await expect(page.locator("#remove")).toHaveText("Remove");

    //Check Local Storage
    const localStorageCart = await getLocalStorageCart(page);
    expect(localStorageCart).toEqual([productsData[i].id]);

    //Navigate to shopping cart
    await checkClickShoppingCartLink(page);

    //Check item successfully appears on shopping cart page
    await checkProductDetails(page, i);
    await page.goBack();

    //Remove item from product page
    await page.locator("#remove").click();
    await expect(page.locator("#add-to-cart")).toHaveText("Add to cart");
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    await checkEmptyLocalStorageCart(page);
    await page.locator("#back-to-products").click();
  }
});
