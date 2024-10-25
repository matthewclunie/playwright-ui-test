import { expect, test } from "@playwright/test";
import productsJSON from "../data/product-info.json";
import {
  checkClickShoppingCartLink,
  checkProductDetails,
  goToInventoryPage,
} from "../utils/utils";
const productsData = JSON.parse(JSON.stringify(productsJSON));

test("Check product links work", async ({ page }) => {
  await goToInventoryPage(page);
  const productLinks = page.locator(".inventory_item_name");
  const productLinkCount = await productLinks.count();

  for (let i = 0; i < productLinkCount; i++) {
    const productLink = productLinks.nth(i);
    await productLink.click();

    //checkProductUtilsContent -- fix checkProductDetails
    await expect(page).toHaveURL(
      `https://www.saucedemo.com/inventory-item.html?id=${productsData[i].id}`
    );
    await checkProductDetails(productLink, i, "src");

    //addItemFromProductUtils
    await expect(page.locator("#add-to-cart")).toHaveText("Add to cart");
    await page.locator("#add-to-cart").click();
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
    await expect(page.locator("#remove")).toHaveText("Remove");

    //checkClickShoppingCartLink
    await checkClickShoppingCartLink(page);

    //checkProductDetails
    await checkProductDetails(page, i);
    await page.goBack();

    //removeItemFromProductUtils
    await page.locator("#remove").click();
    await expect(page.locator("#add-to-cart")).toHaveText("Add to cart");
    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    await page.locator("#back-to-products").click();
  }
});
