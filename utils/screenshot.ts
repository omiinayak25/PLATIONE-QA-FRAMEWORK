import { Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { CONSTANTS } from "../config/constants";
import { logger } from "./logger";

/**
 * Utility class for capturing screenshots during UI tests
 */
export class ScreenshotUtils {
  /**
   * Captures a screenshot of the current page and saves it to the configured screenshot directory
   * @param page Playwright Page instance
   * @param name Name of the screenshot (will be sanitized and timestamped)
   * @returns The absolute path to the saved screenshot
   */
  public static async takeScreenshot(page: Page, name: string): Promise<string> {
    const screenshotDir = path.resolve(CONSTANTS.SCREENSHOT_FOLDER);

    try {
      // Ensure the screenshots folder exists
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      // Sanitize filename: replace spaces and special characters
      const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const timestamp = new Date().getTime();
      const fileName = `${sanitizedName}_${timestamp}.png`;
      const screenshotPath = path.join(screenshotDir, fileName);

      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      logger.info(`Screenshot captured successfully: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      logger.error(`Failed to capture screenshot '${name}':`, error as Error);
      throw error;
    }
  }
}
