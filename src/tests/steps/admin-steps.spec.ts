import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

Given("que acesso o admin", async function (this: CustomWorld) {
  // Não precisa fazer nada aqui pois já estamos logados
  // O login é feito uma única vez no BeforeAll (ver hooks.ts)
});

When(
  "eu estiver logado com email {string} e senha {string}",
  async function (this: CustomWorld, email: string, senha: string) {
    // Não precisa fazer login novamente
    // O login é feito uma única vez no BeforeAll (ver hooks.ts)
  }
);

When("clicar no menu {}", async function (this: CustomWorld, menu: string) {
  await this.adminPage.navegarParaMenu(menu);
});

When(
  "clicar na aba {}",
  { timeout: 62000 },
  async function (this: CustomWorld, aba: string) {
    await this.adminPage.buscarEAbrirAba(aba);
  }
);

When(
  "buscar pelo Usuário {string}",
  async function (this: CustomWorld, usuario: string) {
    await this.adminPage.buscarUsuario(usuario);
  }
);

When("clicar em Detalhes", async function (this: CustomWorld) {
  await this.adminPage.clicarDetalhes();
});

When("clicar em Editar usuário", async function (this: CustomWorld) {
  await this.adminPage.editarUsuario();
});

When("selecionar o perfil Gestão de Conta", async function (this: CustomWorld) {
  await this.adminPage.gerenciarPerfil("adicionar", "Gestão de Conta");
});

When("adicionar o Acesso", async function () {
  // Já implementado no passo anterior
});

When(
  "remover o Acesso ao perfil Gestão de Contas",
  async function (this: CustomWorld) {
    await this.adminPage.gerenciarPerfil("remover", "Gestão de Contas");
  }
);

When("salvar as alterações de acesso", async function (this: CustomWorld) {
  await this.adminPage.salvarAlteracoes();
});

Then("a Gestão de Contas permite edição", async function (this: CustomWorld) {
  const permiteEdicao = await this.adminPage.verificarPermissaoEdicao();
  expect(permiteEdicao).toBe(true);
});

Then(
  "a Gestão de Contas não permite edição",
  async function (this: CustomWorld) {
    const permiteEdicao = await this.adminPage.verificarPermissaoEdicao();
    expect(permiteEdicao).toBe(false);
  }
);
