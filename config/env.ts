import dotenv from "dotenv";

dotenv.config();

/**
 * Reads environment variables from .env
 */
class Environment {
  private getValue(key: string): string {
    const value = process.env[key];

    if (!value) {
      throw new Error(`Environment variable '${key}' is missing.`);
    }

    return value;
  }

  public getBaseUrl(): string {
    return this.getValue("BASE_URL");
  }

  public getApiUrl(): string {
    return this.getValue("API_URL");
  }

  public getUsername(): string {
    return this.getValue("USERNAME");
  }

  public getPassword(): string {
    return this.getValue("PASSWORD");
  }

  public getEnvironment(): string {
    return this.getValue("ENV");
  }

  public getBrowser(): string {
    return process.env.BROWSER || "chromium";
  }

  public isHeadless(): boolean {
    if (process.env.CI) {
      return true;
    }

    return process.env.HEADLESS === "true";
  }

  public getDefaultTimeout(): number {
    return Number(process.env.DEFAULT_TIMEOUT || 30000);
  }

  public getApiTimeout(): number {
    return Number(process.env.API_TIMEOUT || 20000);
  }

  public getRetryCount(): number {
    return Number(process.env.RETRY_COUNT || 2);
  }

  public captureScreenshotOnFailure(): boolean {
    return process.env.SCREENSHOT_ON_FAILURE === "true";
  }
}

export const ENV = new Environment();
