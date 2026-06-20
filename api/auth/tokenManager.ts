import { APIRequestContext } from "@playwright/test";
import { AuthHelper } from "./authHelper";
import { logger } from "../../utils/logger";

/**
 * Singleton class to manage the lifecycle of the API authorization token
 */
export class TokenManager {
  private static instance: TokenManager;
  private cachedToken: string | null = null;

  private constructor() {}

  /**
   * Returns the Singleton instance of TokenManager
   */
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Returns the cached token or authenticates via API if cache is empty
   */
  public async getToken(request: APIRequestContext): Promise<string> {
    if (this.cachedToken) {
      logger.debug("Retrieving cached authentication token.");
      return this.cachedToken;
    }

    logger.info("Authentication token cache is empty. Requesting new session...");
    this.cachedToken = await AuthHelper.loginViaApi(request);
    return this.cachedToken;
  }

  /**
   * Forces clearing the cached token
   */
  public clearToken(): void {
    logger.info("Clearing cached authentication token.");
    this.cachedToken = null;
  }

  /**
   * Refreshes the token by clearing cache and performing a new login request
   */
  public async refreshToken(request: APIRequestContext): Promise<string> {
    logger.info("Refreshing session token.");
    this.clearToken();
    return this.getToken(request);
  }
}
