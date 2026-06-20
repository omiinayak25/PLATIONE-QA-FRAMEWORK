import { Lead } from "../interfaces";
import { RandomUtils } from "../../utils/randomUtils";

/**
 * Factory class for generating Lead test data
 */
export class LeadFactory {
  /**
   * Generates a valid mock Lead with random data
   */
  public static createLead(overrides?: Partial<Lead>): Lead {
    const firstName = RandomUtils.getRandomFirstName();
    return {
      firstName,
      lastName: RandomUtils.getRandomLastName(),
      email: RandomUtils.getRandomEmail(`${firstName.toLowerCase()}_lead`),
      phone: RandomUtils.getRandomPhone(),
      company: RandomUtils.getRandomCompany(),
      status: "New",
      temperature: RandomUtils.getRandomItem(["Hot", "Warm", "Cold"]),
      leadScore: RandomUtils.getRandomNumber(1, 100),
      ...overrides,
    };
  }

  /**
   * Generates a mock Hot Lead (High Score, Hot Temperature)
   */
  public static createHotLead(overrides?: Partial<Lead>): Lead {
    return this.createLead({
      temperature: "Hot",
      leadScore: RandomUtils.getRandomNumber(80, 100),
      ...overrides,
    });
  }

  /**
   * Generates a mock Cold Lead (Low Score, Cold Temperature)
   */
  public static createColdLead(overrides?: Partial<Lead>): Lead {
    return this.createLead({
      temperature: "Cold",
      leadScore: RandomUtils.getRandomNumber(1, 20),
      ...overrides,
    });
  }
}

// Keep helper functions for backward compatibility or simple usage
export const createLead = (overrides?: Partial<Lead>) => LeadFactory.createLead(overrides);
export const createHotLead = (overrides?: Partial<Lead>) => LeadFactory.createHotLead(overrides);
export const createColdLead = (overrides?: Partial<Lead>) => LeadFactory.createColdLead(overrides);
