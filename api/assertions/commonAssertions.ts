import { expect, APIResponse } from "@playwright/test";
import { logger } from "../../utils/logger";

/**
 * Reusable assertions for general API validation
 */
export class CommonAssertions {
  /**
   * Asserts the response status code matches expected status
   */
  public static async assertStatusCode(response: APIResponse, expectedStatusCode: number): Promise<void> {
    logger.info(`Asserting Status Code - Expected: ${expectedStatusCode}, Actual: ${response.status()}`);
    expect(response.status(), `Expected HTTP status ${expectedStatusCode} but got ${response.status()}`).toBe(expectedStatusCode);
  }

  /**
   * Asserts that response is successful (status code between 200 and 299)
   */
  public static async assertSuccess(response: APIResponse): Promise<void> {
    logger.info(`Asserting Response Success (2xx) - Actual Status: ${response.status()}`);
    expect(response.ok(), `Response status code ${response.status()} indicates failure`).toBe(true);
  }

  /**
   * Asserts that the response body contains the specified key-value subsets
   */
  public static async assertBodyContains(response: APIResponse, expectedSubset: Record<string, any>): Promise<void> {
    const body = await response.json();
    logger.info(`Asserting Response Body contains fields: ${Object.keys(expectedSubset).join(", ")}`);
    for (const key of Object.keys(expectedSubset)) {
      expect(body[key], `Field '${key}' expected value '${expectedSubset[key]}' but got '${body[key]}'`).toEqual(
        expectedSubset[key]
      );
    }
  }

  /**
   * Asserts that response status matches, and the error payload contains expected message snippet
   */
  public static async assertError(
    response: APIResponse,
    expectedStatusCode: number,
    expectedMessage?: string
  ): Promise<void> {
    await this.assertStatusCode(response, expectedStatusCode);
    const body = await response.json();
    const errorMessage = body.message || body.error || JSON.stringify(body);
    logger.info(`Asserting Error Message contains: "${expectedMessage}"`);
    if (expectedMessage) {
      expect(errorMessage.toLowerCase()).toContain(expectedMessage.toLowerCase());
    }
  }

  /**
   * Asserts that the measured HTTP latency does not exceed the SLA limit
   */
  public static assertResponseTime(elapsedMs: number, maxTimeMs: number): void {
    logger.info(`Asserting Latency SLA - Elapsed: ${elapsedMs}ms, Max Allowed: ${maxTimeMs}ms`);
    expect(elapsedMs, `Request duration of ${elapsedMs}ms exceeded SLA threshold of ${maxTimeMs}ms`).toBeLessThan(
      maxTimeMs
    );
  }
}
