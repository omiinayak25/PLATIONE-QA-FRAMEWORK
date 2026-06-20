import { Page, Locator } from "@playwright/test";
import { URLS } from "../config/urls";
import { BrowserHelper } from "../utils/browserHelper";
import { logger } from "../utils/logger";

/**
 * Page Object class representing the post-login system Dashboard
 */
export class DashboardPage {
  private page: Page;

  // Interactive selectors
  public readonly welcomeMessage: Locator;
  public readonly contactsMetric: Locator;
  public readonly actionsMetric: Locator;
  public readonly userProfileMenu: Locator;
  public readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator("#welcomeMessage");
    this.contactsMetric = page.locator("#contactsMetric");
    this.actionsMetric = page.locator("#actionsMetric");
    this.userProfileMenu = page.locator("#userProfileMenu");
    this.logoutButton = page.locator("#logoutButton");
  }

  /**
   * Navigates directly to the Dashboard page URL
   */
  public async navigate(): Promise<void> {
    await BrowserHelper.navigateTo(this.page, URLS.DASHBOARD, "Dashboard Page");
  }

  /**
   * Determines if the Welcome message card is loaded
   */
  public async isWelcomeMessageVisible(): Promise<boolean> {
    return BrowserHelper.isVisible(this.page, this.welcomeMessage);
  }

  /**
   * Expands user profile settings and selects logout
   */
  public async logout(): Promise<void> {
    logger.info("UI Action: Performing logout sequence.");
    await BrowserHelper.click(this.page, this.userProfileMenu, "User Settings Avatar");
    await BrowserHelper.click(this.page, this.logoutButton, "Logout Context option");
    await BrowserHelper.waitForNetworkIdle(this.page);
  }
}
