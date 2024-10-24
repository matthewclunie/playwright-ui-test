import { Page } from "playwright";
import { expect, Locator } from "playwright/test";
import productsJSON from "./product-info.json";
import optionsJSON from "./dropdown-info.json";

const optionsData = JSON.parse(JSON.stringify(optionsJSON));
const productsData = JSON.parse(JSON.stringify(productsJSON));

interface DropdownSelects {
  value: string;
  text: string;
  getTexts: () => Promise<string[]>;
  sortedTexts: string[];
}

export class ProductUtils {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkproductUtilsContent(i: number) {
    await expect(this.page).toHaveURL(
      `https://www.saucedemo.com/inventory-item.html?id=${productsData[i].id}`
    );
    await expect(this.page.locator(".inventory_details_name")).toHaveText(
      productsData[i].title
    );
    await expect(this.page.locator(".inventory_details_desc")).toHaveText(
      productsData[i].description
    );
    await expect(this.page.locator(".inventory_details_price")).toHaveText(
      productsData[i].price
    );
    expect(this.page.locator(".inventory_details_img")).toHaveAttribute(
      "src",
      productsData[i].imageSrc
    );
  }

  async addItemFromproductUtils() {
    await expect(this.page.locator("#add-to-cart")).toHaveText("Add to cart");
    await this.page.locator("#add-to-cart").click();
    await expect(this.page.locator(".shopping_cart_badge")).toHaveText("1");
    await expect(this.page.locator("#remove")).toHaveText("Remove");
  }

  async removeItemFromproductUtils() {
    await this.page.locator("#remove").click();
    await expect(this.page.locator("#add-to-cart")).toHaveText("Add to cart");
    await expect(this.page.locator(".shopping_cart_badge")).not.toBeVisible();
  }

  checkProductDetails = async (element: Locator | Page, i: number) => {
    await expect(element.locator(".inventory_item_name")).toHaveText(
      productsData[i].title
    );
    await expect(element.locator(".inventory_item_desc")).toHaveText(
      productsData[i].description
    );
    await expect(element.locator(".inventory_item_price")).toHaveText(
      productsData[i].price
    );
  };

  async checkForProductContent() {
    const products = this.page.locator(".inventory_item");
    const productsCount = await products.count();

    for (let i = 0; i < productsCount; i++) {
      const product = products.nth(i);
      await this.checkProductDetails(product, i);
      await expect(product.locator("img.inventory_item_img")).toHaveAttribute(
        "src",
        productsData[i].imageSrc
      );
    }
  }

  async checkProductSortOptions() {
    const options = this.page.locator("option");
    const optionsCount = await options.count();

    for (let i = 0; i < optionsCount; i++) {
      const option = options.nth(i);
      await expect(option).toHaveText(optionsData[i].text);
      await expect(option).toHaveAttribute("value", optionsData[i].value);
    }
    await expect(options).toHaveCount(4);
  }

  async getProductLabels() {
    const productLabels = this.page.locator(".inventory_item_name ");
    return await productLabels.allInnerTexts();
  }

  async getProductPrices() {
    const productPrices = this.page.locator(".inventory_item_price");
    return await productPrices.allInnerTexts();
  }

  getSortedProductLabels(productLabels: string[]) {
    return [...productLabels].sort();
  }

  getRevSortedProductLabels(sortedLabels: string[]) {
    return [...sortedLabels].reverse();
  }

  getSortedPrices(productPrices: string[]) {
    return [...productPrices].sort((a, b) => {
      const priceA = parseFloat(a.replace("$", ""));
      const priceB = parseFloat(b.replace("$", ""));
      return priceA - priceB;
    });
  }

  getRevSortedPrices(sortedPrices: string[]) {
    return [...sortedPrices].reverse();
  }

  async checkProductSort(dropdownSelects: DropdownSelects[]) {
    const activeSelector = this.page.locator(".active_option");
    const dropdown = this.page.locator(".product_sort_container");

    for (const select of dropdownSelects) {
      await dropdown.selectOption(select.value);
      await expect(activeSelector).toHaveText(select.text);
      const texts = await select.getTexts();
      expect(texts).toEqual(select.sortedTexts);
    }
  }
}

module.exports = { ProductUtils };
