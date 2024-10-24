import { test } from "@playwright/test";
import { UtilManager } from "../utils/util-manager";

test("Check product links work", async ({ page }) => {
  const utilManager = new UtilManager(page);
  const inventoryUtils = utilManager.getInventoryUtils();
  const productUtils = utilManager.getProductUtils();
  const shoppingCartUtils = utilManager.getShoppingCartUtils();

  await inventoryUtils.goToInventoryPage();
  const productLinks = page.locator(".inventory_item_name");
  const productLinkCount = await productLinks.count();

  for (let i = 0; i < productLinkCount; i++) {
    const productLink = productLinks.nth(i);
    await productLink.click();
    await productUtils.checkproductUtilsContent(i);

    await productUtils.addItemFromproductUtils();
    await shoppingCartUtils.checkClickShoppingCartLink();
    await productUtils.checkProductDetails(page, i);
    await page.goBack();
    await productUtils.removeItemFromproductUtils();
    await page.locator("#back-to-products").click();
  }
});
