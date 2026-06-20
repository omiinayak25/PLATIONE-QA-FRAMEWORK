import { ENV } from "../config/env";

/**
 * Utility helper for managing environment-specific configurations and checks
 */
export class EnvironmentHelper {
  /**
   * Returns true if running in QA environment
   */
  public static isQA(): boolean {
    return ENV.getEnvironment().toUpperCase() === "QA";
  }

  /**
   * Returns true if running in Staging environment
   */
  public static isStaging(): boolean {
    return ENV.getEnvironment().toUpperCase() === "STAGING";
  }

  /**
   * Returns true if running in Production environment
   */
  public static isProduction(): boolean {
    return ENV.getEnvironment().toUpperCase() === "PRODUCTION";
  }

  /**
   * Retrieves Database Host
   */
  public static getDbHost(): string {
    return process.env.DB_HOST || "localhost";
  }

  /**
   * Retrieves Database Port
   */
  public static getDbPort(): number {
    return Number(process.env.DB_PORT || 3306);
  }

  /**
   * Retrieves Database User
   */
  public static getDbUser(): string {
    return process.env.DB_USER || "root";
  }

  /**
   * Retrieves Database Password
   */
  public static getDbPassword(): string {
    return process.env.DB_PASSWORD || "password";
  }

  /**
   * Retrieves Database Name
   */
  public static getDbName(): string {
    return process.env.DB_NAME || "platione_sales_assist";
  }
}
