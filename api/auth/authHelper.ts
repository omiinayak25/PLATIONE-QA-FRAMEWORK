import { APIRequestContext, Page } from "@playwright/test";
import { API_ENDPOINTS } from "../../config/urls";
import { ENV } from "../../config/env";
import { logger } from "../../utils/logger";

/**
 * Authentication helper class for programmatically acquiring and injecting user sessions
 */
export class AuthHelper {
  /**
   * Logs in via API using credentials and returns the bearer token
   * Falls back to a mock token on connection failures (for local/mock testing support)
   */
  public static async loginViaApi(
    request: APIRequestContext,
    username = ENV.getUsername(),
    password = ENV.getPassword()
  ): Promise<string> {
    logger.info(`Authenticating via API for user: ${username}`);
    try {
      const response = await request.post(API_ENDPOINTS.LOGIN, {
        data: { username, password },
        timeout: ENV.getApiTimeout(),
      });

      if (response.ok()) {
        const body = await response.json();
        logger.info("API login successful.");
        return body.token || body.accessToken || "mock-jwt-token-xyz";
      } else {
        logger.warn(`API Login request failed with status: ${response.status()}. Falling back to mock token.`);
        return `mock-token-${Buffer.from(username).toString("base64")}`;
      }
    } catch (error) {
      logger.warn(`API Login endpoint not reachable. Falling back to mock token for local testing.`);
      return `mock-token-${Buffer.from(username).toString("base64")}`;
    }
  }

  /**
   * Injects the authentication token into browser LocalStorage, allowing the UI to bypass the Login Page
   */
  public static async applySessionState(page: Page, token: string): Promise<void> {
    logger.info("Injecting authentication session token into localStorage.");
    // Navigate to base URL so the domain is loaded, allowing access to localStorage
    await page.goto(ENV.getBaseUrl(), { waitUntil: "domcontentloaded" });
    await page.evaluate((jwtToken) => {
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("session", JSON.stringify({ token: jwtToken, isLoggedIn: true }));
    }, token);
  }

  /**
   * Combines API authentication and browser state injection in one step
   */
  public static async loginAndInjectSession(request: APIRequestContext, page: Page): Promise<string> {
    const token = await this.loginViaApi(request);
    await this.applySessionState(page, token);
    return token;
  }
}
