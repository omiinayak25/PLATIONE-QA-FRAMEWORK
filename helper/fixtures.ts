import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/dashboardPage";
import { ContactPage } from "../pages/contactPage";
import { ActionPage } from "../pages/actionPage";
import { InteractionPage } from "../pages/interactionPage";
import { ContactClient } from "../api/clients/contactClient";
import { ActionClient } from "../api/clients/actionClient";
import { InteractionClient } from "../api/clients/interactionClient";
import { ApiSeeder } from "../data/seeders/apiSeeder";
import { DbSeeder } from "../data/seeders/dbSeeder";

/**
 * Custom fixture types definition for the framework dependency injection
 */
export type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  contactPage: ContactPage;
  actionPage: ActionPage;
  interactionPage: InteractionPage;
  contactClient: ContactClient;
  actionClient: ActionClient;
  interactionClient: InteractionClient;
  apiSeeder: ApiSeeder;
  dbSeeder: DbSeeder;
};

/**
 * Extended Playwright test instance that binds Page Objects, Clients, and Seeders
 */
export const test = baseTest.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  actionPage: async ({ page }, use) => {
    await use(new ActionPage(page));
  },
  interactionPage: async ({ page }, use) => {
    await use(new InteractionPage(page));
  },
  contactClient: async ({ request }, use) => {
    const client = await ContactClient.create(request);
    await use(client);
  },
  actionClient: async ({ request }, use) => {
    const client = await ActionClient.create(request);
    await use(client);
  },
  interactionClient: async ({ request }, use) => {
    const client = await InteractionClient.create(request);
    await use(client);
  },
  apiSeeder: async ({ request }, use) => {
    const seeder = await ApiSeeder.create(request);
    await use(seeder);
    // Automated API cleanup hook run after the test ends
    await seeder.cleanup();
  },
  dbSeeder: async ({}, use) => {
    const seeder = new DbSeeder();
    await use(seeder);
    // Automated DB rollback hook run after the test ends
    await seeder.cleanup();
    await seeder.closeConnection();
  },
});

export { expect } from "@playwright/test";
