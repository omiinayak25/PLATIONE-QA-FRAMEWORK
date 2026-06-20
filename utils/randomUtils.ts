import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

/**
 * Utility class for generating random/mock test data
 */
export class RandomUtils {
  /**
   * Generates a random alphanumeric or alphabetic string of a specified length
   */
  public static getRandomString(
    length: number,
    type: "alphabetic" | "numeric" | "alphanumeric" = "alphanumeric"
  ): string {
    let characters = "";
    if (type === "alphabetic" || type === "alphanumeric") {
      characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }
    if (type === "numeric" || type === "alphanumeric") {
      characters += "0123456789";
    }

    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Generates a unique UUID
   */
  public static getUUID(): string {
    return uuidv4();
  }

  /**
   * Generates a random email address
   */
  public static getRandomEmail(prefix = "test", domain = "plationetest.com"): string {
    const uniqueId = this.getRandomString(6, "numeric");
    return `${prefix}_${uniqueId}@${domain}`;
  }

  /**
   * Generates a random phone number
   */
  public static getRandomPhone(): string {
    // Generates a standard 10-digit number
    return `+1${this.getRandomString(10, "numeric")}`;
  }

  /**
   * Generates a random first name
   */
  public static getRandomFirstName(): string {
    return faker.person.firstName();
  }

  /**
   * Generates a random last name
   */
  public static getRandomLastName(): string {
    return faker.person.lastName();
  }

  /**
   * Generates a random full name
   */
  public static getRandomFullName(): string {
    return `${this.getRandomFirstName()} ${this.getRandomLastName()}`;
  }

  /**
   * Generates a random company name
   */
  public static getRandomCompany(): string {
    return faker.company.name();
  }

  /**
   * Generates a random number between min and max (inclusive)
   */
  public static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns a random item from an array
   */
  public static getRandomItem<T>(items: T[]): T {
    const index = this.getRandomNumber(0, items.length - 1);
    return items[index];
  }

  /**
   * Generates a random boolean
   */
  public static getRandomBoolean(): boolean {
    return Math.random() >= 0.5;
  }
}
