import { Browser, BrowserContext, Page, chromium } from "@playwright/test";

export class BrowserSetup {
  private static instance: BrowserSetup;
  private _browser: Browser | null = null;
  private _context: BrowserContext | null = null;
  private _page: Page | null = null;

  private constructor() {}

  static getInstance(): BrowserSetup {
    if (!BrowserSetup.instance) {
      BrowserSetup.instance = new BrowserSetup();
    }
    return BrowserSetup.instance;
  }

  async initialize() {
    console.log("Iniciando setup do browser...");

    const launchOptions = {
      headless: process.env.HEADLESS !== "false",
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 100,
      devtools: process.env.PWDEBUG === "1",
    };

    console.log("Launch options:", launchOptions);

    if (!this._browser) {
      this._browser = await chromium.launch(launchOptions);
      console.log("Browser launched");
    }

    if (!this._context) {
      this._context = await this._browser.newContext({
        viewport: { width: 1600, height: 900 },
      });
      console.log("Context created");
    }

    if (!this._page) {
      this._page = await this._context.newPage();
      console.log("Page created");
    }

    return {
      browser: this._browser,
      context: this._context,
      page: this._page,
    };
  }

  async cleanup() {
    if (this._page) {
      await this._page.close();
      this._page = null;
    }
    if (this._context) {
      await this._context.close();
      this._context = null;
    }
    if (this._browser) {
      await this._browser.close();
      this._browser = null;
    }
  }

  get browser() {
    return this._browser;
  }
  get context() {
    return this._context;
  }
  get page() {
    return this._page;
  }
}

export const browserSetup = BrowserSetup.getInstance();
