import { expect, APIResponse } from "@playwright/test";
import { Contact } from "../../data/interfaces";
import { CommonAssertions } from "./commonAssertions";
import { logger } from "../../utils/logger";

/**
 * Custom assertions for validating Contact API models
 */
export class ContactAssertions {
  /**
   * Asserts fields of a retrieved Contact object match expected Contact data
   */
  public static async assertContactValues(actualContact: any, expectedContact: Contact): Promise<void> {
    logger.info(`Asserting Contact Fields match for: ${expectedContact.firstName} ${expectedContact.lastName}`);
    expect(actualContact.firstName).toBe(expectedContact.firstName);
    expect(actualContact.lastName).toBe(expectedContact.lastName);
    expect(actualContact.email).toBe(expectedContact.email);
    expect(actualContact.phone).toBe(expectedContact.phone);
    expect(actualContact.company).toBe(expectedContact.company);
    expect(actualContact.status).toBe(expectedContact.status);
    if (expectedContact.id) {
      expect(actualContact.id).toBe(expectedContact.id);
    }
  }

  /**
   * Asserts a Contact was successfully created (200 or 201) and returns fields matching expected inputs
   */
  public static async assertContactCreated(response: APIResponse, expectedContact: Contact): Promise<void> {
    const actualStatus = response.status();
    logger.info(`Asserting Contact Creation - Actual Status Code: ${actualStatus}`);
    expect([200, 201].includes(actualStatus), `Expected status 200/201 but got ${actualStatus}`).toBe(true);

    const body = await response.json();
    expect(body.id, "Expected newly created contact to return a valid 'id' property").toBeTruthy();
    await this.assertContactValues(body, expectedContact);
  }

  /**
   * Asserts a Contact list search contains the expected contact record
   */
  public static async assertListContainsContact(response: APIResponse, expectedContact: Contact): Promise<void> {
    await CommonAssertions.assertSuccess(response);
    const list: any[] = await response.json();
    logger.info(`Asserting list contains Contact with email: ${expectedContact.email}`);

    const match = list.find((c) => c.email === expectedContact.email);
    expect(match, `Contact with email '${expectedContact.email}' was not found in the response list.`).toBeDefined();
    await this.assertContactValues(match, expectedContact);
  }

  /**
   * Asserts duplicate contact registration results in a 400 Bad Request or 409 Conflict with 'duplicate' error message
   */
  public static async assertDuplicateContactError(response: APIResponse): Promise<void> {
    const status = response.status();
    logger.info(`Asserting Duplicate Contact Validation Error - Status: ${status}`);
    expect([400, 409].includes(status), `Expected duplicate error code 400/409 but got ${status}`).toBe(true);

    const body = await response.json();
    const msg = (body.message || body.error || JSON.stringify(body)).toLowerCase();
    expect(msg).toContain("duplicate");
  }
}
