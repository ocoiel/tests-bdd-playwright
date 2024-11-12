import { Before, BeforeAll, After, AfterAll } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import { CustomWorld } from "./world";
import { AdminPage } from "../pages/Admin";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let adminPage: AdminPage;

BeforeAll(async function () {
  // Configurações específicas para modo debug
  const launchOptions = {
    headless: process.env.HEADLESS !== "false",
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    // Adiciona configurações específicas para debug
    devtools: process.env.PWDEBUG === "1",
  };

  // Se estiver em modo debug, ajusta algumas configurações
  if (process.env.PWDEBUG === "1") {
    Object.assign(launchOptions, {
      timeout: 0, // Desativa timeout no modo debug
      headless: false, // Força modo não-headless em debug
    });
  }

  try {
    browser = await chromium.launch(launchOptions);

    context = await browser.newContext({
      viewport: { width: 1600, height: 900 },
      // Adiciona configurações para melhor debug
      recordVideo:
        process.env.PWDEBUG === "1"
          ? {
              dir: "./test-results/videos/",
            }
          : undefined,
    });

    // Configura listeners de erro para debug
    context.on("page", async (page) => {
      page.on("pageerror", (exception) => {
        console.error("Uncaught exception:", exception);
      });
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          console.error("Console error:", msg.text());
        }
      });
    });

    page = await context.newPage();
    adminPage = new AdminPage(page);

    // Aumenta timeouts em modo debug
    if (process.env.PWDEBUG === "1") {
      await page.setDefaultTimeout(0);
      await page.setDefaultNavigationTimeout(0);
    }

    await adminPage.acessarAdmin();
    await adminPage.login("ifc.bot.boleto@gmail.com", "Teste@123");
    await context.storageState({ path: "auth.json" });
  } catch (error) {
    console.error("Error during setup:", error);
    throw error;
  }
});

Before(async function (this: CustomWorld) {
  // Adiciona try-catch para melhor debug
  try {
    this.page = page;
    this.adminPage = adminPage;
  } catch (error) {
    console.error("Error in Before hook:", error);
    throw error;
  }
});

After(async function (this: CustomWorld) {
  if (this.page) {
    try {
      // Limpa cookies e localStorage apenas se não estiver em modo debug
      if (process.env.PWDEBUG !== "1") {
        await this.page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
      }
    } catch (error) {
      console.error("Error in After hook:", error);
    }
  }
});

AfterAll(async function () {
  try {
    // Em modo debug, da mais tempo antes de fechar
    if (process.env.PWDEBUG === "1") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    await context?.close();
    await browser?.close();
  } catch (error) {
    console.error("Error in AfterAll hook:", error);
  }
});
