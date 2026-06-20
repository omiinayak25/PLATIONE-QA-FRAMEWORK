import { Page, Locator } from "@playwright/test";
import { CONSTANTS } from "../config/constants";
import { logger } from "./logger";

/**
 * Helper class for standard Playwright browser interactions with integrated logging and timeouts
 */
export class BrowserHelper {
  /**
   * Resolves a string selector or returns the Locator directly
   */
  private static getLocator(page: Page, selector: string | Locator): Locator {
    return typeof selector === "string" ? page.locator(selector) : selector;
  }

  /**
   * Clicks on an element after waiting for it to be visible and enabled
   */
  public static async click(
    page: Page,
    selector: string | Locator,
    description: string,
    timeout: number = CONSTANTS.DEFAULT_TIMEOUT
  ): Promise<void> {
    const locator = this.getLocator(page, selector);
    logger.debug(`Clicking on: ${description}`);
    try {
      await locator.waitFor({ state: "visible", timeout });
      await locator.click({ timeout });
    } catch (error) {
      logger.error(`Failed to click on: ${description}`, error as Error);
      throw error;
    }
  }

  /**
   * Fills an input field after waiting for visibility, clearing previous content
   */
  public static async fill(
    page: Page,
    selector: string | Locator,
    value: string,
    description: string,
    timeout: number = CONSTANTS.DEFAULT_TIMEOUT
  ): Promise<void> {
    const locator = this.getLocator(page, selector);
    // Mask sensitive details like passwords in logs
    const logValue = description.toLowerCase().includes("password") ? "********" : value;
    logger.debug(`Filling ${description} with value: "${logValue}"`);
    try {
      await locator.waitFor({ state: "visible", timeout });
      await locator.fill(value, { timeout });
    } catch (error) {
      logger.error(`Failed to fill: ${description}`, error as Error);
      throw error;
    }
  }

  /**
   * Retrieves text content from a locator
   */
  public static async getText(
    page: Page,
    selector: string | Locator,
    timeout: number = CONSTANTS.DEFAULT_TIMEOUT
  ): Promise<string> {
    const locator = this.getLocator(page, selector);
    try {
      await locator.waitFor({ state: "visible", timeout });
      const text = await locator.textContent({ timeout });
      return text ? text.trim() : "";
    } catch (error) {
      logger.error(`Failed to retrieve text content`, error as Error);
      throw error;
    }
  }

  /**
   * Checks if an element is currently visible (non-blocking)
   */
  public static async isVisible(
    page: Page,
    selector: string | Locator
  ): Promise<boolean> {
    const locator = this.getLocator(page, selector);
    return locator.isVisible();
  }

  /**
   * Navigates to a specific URL
   */
  public static async navigateTo(page: Page, url: string, description: string): Promise<void> {
    logger.info(`Navigating to ${description}: ${url}`);
    try {
      await page.goto(url, { waitUntil: "load" });
    } catch (error) {
      logger.error(`Failed to navigate to: ${description}`, error as Error);
      throw error;
    }
  }

  /**
   * Waits for the network to become idle
   */
  public static async waitForNetworkIdle(page: Page, timeout: number = CONSTANTS.SHORT_TIMEOUT): Promise<void> {
    logger.debug("Waiting for network idle state...");
    try {
      await page.waitForLoadState("networkidle", { timeout });
    } catch (error) {
      logger.warn(`Network idle was not reached within ${timeout}ms.`);
    }
  }
}
