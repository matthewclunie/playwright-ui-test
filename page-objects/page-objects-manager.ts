import { Page } from "playwright";

import { InventoryPage } from "../page-objects/inventory-page-utils";

export class PageObjectsManager {
  page: Page;
  inventoryPage: InventoryPage;

  constructor(page: Page) {
    this.page = page;
    this.inventoryPage = new InventoryPage(page);
  }

  getInventoryPage() {
    return this.inventoryPage;
  }
}

module.exports = { PageObjectsManager };
