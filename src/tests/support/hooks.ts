// src/support/hooks.ts
import {
  Before,
  BeforeAll,
  After,
  AfterAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { AdminPage } from "../pages/Admin";
import { browserSetup } from "./BrowserSetup";

// Aumenta MUITO o timeout quando em debug
if (process.env.PWDEBUG === "1") {
  setDefaultTimeout(300000); // 5 minutos
} else {
  setDefaultTimeout(60000); // 1 minuto
}

BeforeAll(async function () {
  try {
    console.log("Iniciando setup global...");
    await browserSetup.initialize();
    console.log("Setup global concluído");
  } catch (error) {
    console.error("Erro no setup global:", error);
    throw error;
  }
});

Before(async function (this: CustomWorld) {
  try {
    const page = browserSetup.page;
    if (!page) {
      throw new Error("Page não foi inicializada corretamente");
    }

    this.page = page;
    this.adminPage = new AdminPage(page);

    // Se for a primeira execução, faz o login
    if (!process.env.LOGIN_DONE) {
      console.log("Realizando login inicial...");
      await this.adminPage.acessarAdmin();
      await this.adminPage.login("ifc.bot.boleto@gmail.com", "Teste@123");
      process.env.LOGIN_DONE = "true";
      console.log("Login realizado com sucesso");
    }
  } catch (error) {
    console.error("Erro no Before hook:", error);
    throw error;
  }
});

After(async function () {
  // Mantenha vazio por enquanto
});

AfterAll(async function () {
  if (process.env.PWDEBUG === "1") {
    console.log("Modo debug - aguardando antes de fechar...");
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }
  await browserSetup.cleanup();
});
