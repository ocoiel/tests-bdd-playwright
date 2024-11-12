// src/pages/AdminPage.ts
import { Page } from "@playwright/test";

export class AdminPage {
  constructor(private page: Page) {}

  async acessarAdmin() {
    await this.page.goto(
      process.env.ADMIN_URL_PROD || "https://admin.evos.shop/auth"
    );
    // Espera a página carregar completamente
    await this.page.waitForLoadState("networkidle");
  }

  async login(email: string, password: string) {
    // Espera os elementos estarem presentes e visíveis
    await this.page.waitForSelector("#login", { state: "visible" });
    await this.page.waitForSelector("#password", { state: "visible" });

    // Limpa os campos antes de preencher
    await this.page.fill("#login", "");
    await this.page.fill("#password", "");

    // Preenche os campos
    await this.page.fill("#login", email);
    await this.page.fill("#password", password);

    // Espera o botão de submit e clica
    const submitButton = await this.page.waitForSelector(
      'button[type="submit"]',
      { state: "visible", timeout: 6000 }
    );
    await submitButton.click();

    // Espera a navegação completar
    await this.page.waitForLoadState("networkidle");
  }

  async navegarParaMenu(menu: string) {
    await this.page.waitForSelector(`text=${menu}`, { state: "visible" });
    await this.page.click(`text=${menu}`);
    await this.page.waitForLoadState("networkidle");
  }

  // async clicarAba(aba: string) {
  //   await this.page.waitForLoadState("networkidle");
  //   console.log("🚀 ~ AdminPage ~ clicarAba ~ aba:", aba);
  //   await this.page.waitForSelector(`text=${aba}`, {
  //     timeout: 60000,
  //   });
  //   await this.page.click(`text=${aba}`);

  //   // --------------------

  //   // Primeiro, garantir que o menu está presente e visível
  //   // await this.page.waitForSelector('ul[data-menu-list="true"]', {
  //   //   state: "visible",
  //   // });

  //   // // Usar seletor específico para encontrar o span com a classe `ant-menu-title-content` e o texto correto
  //   // const menuSelector = `ul[data-menu-list="true"] li div[role="menuitem"] span.ant-menu-title-content:has-text("${aba}")`;
  //   // await this.page.waitForSelector(menuSelector, { state: "visible" });
  //   // console.log("🚀 ~ AdminPage ~ clicarAba ~ menuSelector:", menuSelector);

  //   // // Clicar no item do menu com segurança
  //   // await this.page.click(menuSelector);

  //   // // Pausa opcional para permitir que a navegação carregue
  //   // await this.page.waitForLoadState("networkidle");
  //   // await this.page.waitForTimeout(1500); // Pequena pausa para estabilidade
  // }

  async buscarEAbrirAba(aba: string) {
    console.log(`Iniciando busca pela aba: ${aba}`);

    // 1. Aguarda e clica na lupa para abrir a barra de pesquisa
    const searchIconSelector = '._search-bar-wrapper_tjx84_279[role="button"]';
    await this.page.waitForSelector(searchIconSelector, {
      state: "visible",
      timeout: 20000,
    });
    console.log("Lupa encontrada, clicando para abrir a barra de pesquisa.");
    await this.page.click(searchIconSelector);

    // 2. Aguarda o campo de busca e preenche o valor vindo do BDD
    const searchInputSelector = "input.ant-input.ant-input-borderless";
    await this.page.waitForSelector(searchInputSelector, {
      state: "visible",
      timeout: 6000,
    });
    console.log(`Campo de busca visível, preenchendo com: ${aba}`);
    await this.page.fill(searchInputSelector, aba);

    // 3. Aguarda e clica na opção correspondente
    const optionSelector = `text=${aba}`;
    await this.page.waitForSelector(optionSelector, {
      state: "visible",
      timeout: 10000,
    });
    console.log(`Opção "${aba}" encontrada, clicando na aba.`);
    await this.page.click(optionSelector);
    console.log(`Aba "${aba}" carregada e selecionada.`);
  }

  async buscarUsuario(usuario: string) {
    // Espera o input de busca estar visível
    await this.page.waitForSelector('input[name="search"]', {
      state: "visible",
    });

    // Limpa o campo antes de preencher
    await this.page.fill('input[name="search"]', "");

    // Preenche o campo com o texto de busca
    await this.page.fill('input[name="search"]', usuario);

    // Espera a requisição da busca completar
    await this.page.waitForLoadState("networkidle");
  }

  async clicarDetalhes() {
    await this.page.waitForSelector("text=Detalhes", { state: "visible" });
    await this.page.click("text=Detalhes");
    await this.page.waitForLoadState("networkidle");
  }

  async editarUsuario() {
    await this.page.waitForSelector("text=Editar usuário", {
      state: "visible",
    });
    await this.page.click("text=Editar usuário");
    await this.page.waitForLoadState("networkidle");
  }

  async gerenciarPerfil(acao: "adicionar" | "remover", perfil: string) {
    if (acao === "adicionar") {
      // Locate and click the select component to open the dropdown
      const seletorPerfil = this.page
        .locator("div.ant-form-item")
        .filter({ has: this.page.locator('label[for="profileId"]') })
        .locator(".ant-select-selector")
        .first();
      await seletorPerfil.click();

      // Wait for the dropdown to appear
      await this.page.waitForSelector(".ant-select-dropdown", {
        state: "visible",
      });
      console.log("Seletor de perfil encontrado e visível.");

      // Localiza o input de busca dentro do dropdown
      const searchInput = this.page.locator(
        ".ant-select-dropdown input.ant-input"
      );

      if (!(await searchInput.isVisible())) {
        throw new Error("Campo de busca do select não encontrado.");
      }

      console.log("Input de busca encontrado.");

      // Preenche o input com o nome do perfil
      await searchInput.fill(perfil);
      // await this.page.pause();

      console.log(`Preenchido o input de busca com o perfil: ${perfil}`);

      const optionLocator = this.page.locator(
        `.ant-select-item-option-content:has-text("${perfil}")`
      );

      // Ensure the option is available
      await optionLocator.waitFor({ state: "attached", timeout: 10000 });

      await optionLocator.first().click({ timeout: 10000 });

      await this.page
        .locator("button:has-text('Adicionar')")
        .click({ timeout: 10000 });

      // Wait for any network activity to finish
      await this.page.waitForLoadState("networkidle", { timeout: 10000 });
    } else {
      // Remove the profile
      const removeButtonSelector = `[title="${perfil}"] .anticon-close`;
      const removeButton = await this.page.$(removeButtonSelector);

      if (removeButton) {
        await removeButton.click();
        await this.page.waitForLoadState("networkidle");
      } else {
        throw new Error(`Perfil ${perfil} não encontrado para remoção`);
      }
    }
  }

  async salvarAlteracoes() {
    await this.page.waitForSelector('button:has-text("Salvar")', {
      state: "visible",
    });
    await this.page.click('button:has-text("Salvar")');
    await this.page.waitForLoadState("networkidle");
  }

  async verificarPermissaoEdicao(): Promise<boolean> {
    try {
      await this.page.waitForSelector('button:has-text("Editar")', {
        state: "visible",
        timeout: 6000,
      });
      return true;
    } catch {
      return false;
    }
  }
}
