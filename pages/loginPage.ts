import { Page, Locator } from "@playwright/test";
import { URLS } from "../config/urls";
import { BrowserHelper } from "../utils/browserHelper";
import { logger } from "../utils/logger";

/**
 * Page Object class representing the login portal interface
 */
export class LoginPage {
  private page: Page;

  // Interactive selectors
  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;
  public readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#usernameInput");
    this.passwordInput = page.locator("#passwordInput");
    this.loginButton = page.locator("#loginButton");
    this.errorMessage = page.locator("#errorMessage");
  }

  /**
   * Navigates to the Login page URL
   */
  public async navigate(): Promise<void> {
    await BrowserHelper.navigateTo(this.page, URLS.LOGIN, "Login Page");
  }

  /**
   * Fills credentials and clicks the login button
   */
  public async login(username: string, password: string): Promise<void> {
    logger.info(`UI Login Attempt: User - ${username}`);
    await BrowserHelper.fill(this.page, this.usernameInput, username, "Username Input field");
    await BrowserHelper.fill(this.page, this.passwordInput, password, "Password Input field");
    await BrowserHelper.click(this.page, this.loginButton, "Sign-in Submit button");
    await BrowserHelper.waitForNetworkIdle(this.page);
  }

  /**
   * Retrieves text details of error toasts or labels on authentication failure
   */
  public async getErrorMessage(): Promise<string> {
    return BrowserHelper.getText(this.page, this.errorMessage);
  }
}
