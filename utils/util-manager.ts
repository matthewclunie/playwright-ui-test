import { Page } from "playwright";

import { InventoryUtils } from "./inventory-utils";
import { ProductUtils } from "./product-utils";
import { ShoppingCartUtils } from "./shopping-cart-utils";
import { NavBarUtils } from "./navbar-utils";
import { FooterUtils } from "./footer-utils";

export class UtilManager {
  page: Page;
  inventoryUtils: InventoryUtils;
  productUtils: ProductUtils;
  shoppingCartUtils: ShoppingCartUtils;
  navBarUtils: NavBarUtils;
  footerUtils: FooterUtils;

  constructor(page: Page) {
    this.page = page;
    this.inventoryUtils = new InventoryUtils(page);
    this.productUtils = new ProductUtils(page);
    this.shoppingCartUtils = new ShoppingCartUtils(page);
    this.navBarUtils = new NavBarUtils(page);
    this.footerUtils = new FooterUtils(page);
  }

  getInventoryUtils() {
    return this.inventoryUtils;
  }

  getProductUtils() {
    return this.productUtils;
  }

  getShoppingCartUtils() {
    return this.shoppingCartUtils;
  }

  getNavBarUtils() {
    return this.navBarUtils;
  }

  getFooterUtils() {
    return this.footerUtils;
  }
}

module.exports = { UtilManager };
