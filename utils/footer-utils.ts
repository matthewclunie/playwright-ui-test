import { Page } from "playwright";
import { expect } from "playwright/test";
import footerJSON from "./dropdown-info.json";

const footerData = JSON.parse(JSON.stringify(footerJSON));

export class FooterUtils {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkFooterLink(page: Page, identifier: string, url: string) {
    const newTabPromise = page.waitForEvent("popup");
    await page.locator(identifier).click();
    const newTab = await newTabPromise;
    await expect(newTab).toHaveURL(url);
    await newTab.close();
  }

  async checkFooterLinks() {
    for (const footerLink of footerData) {
      await this.checkFooterLink(
        this.page,
        footerLink.identifier,
        footerLink.url
      );
    }
  }

  async checkFooterText(footerText: string) {
    await expect(this.page.locator(".footer_copy")).toHaveText(footerText);
  }
}

module.exports = { FooterUtils };
