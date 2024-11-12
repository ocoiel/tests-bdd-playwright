import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import { AdminPage } from "../pages/Admin";

export class CustomWorld extends World {
  public page!: Page;
  public adminPage!: AdminPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
