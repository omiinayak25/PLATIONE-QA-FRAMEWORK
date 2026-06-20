import { Contact } from "../interfaces";
import { RandomUtils } from "../../utils/randomUtils";

/**
 * Factory class for generating Contact test data
 */
export class ContactFactory {
  /**
   * Generates a valid mock Contact with random data
   */
  public static createContact(overrides?: Partial<Contact>): Contact {
    const firstName = RandomUtils.getRandomFirstName();
    return {
      firstName,
      lastName: RandomUtils.getRandomLastName(),
      email: RandomUtils.getRandomEmail(firstName.toLowerCase()),
      phone: RandomUtils.getRandomPhone(),
      company: RandomUtils.getRandomCompany(),
      status: "Active",
      ...overrides,
    };
  }

  /**
   * Generates a valid mock Customer Contact
   */
  public static createCustomer(overrides?: Partial<Contact>): Contact {
    return this.createContact({
      status: "Customer",
      ...overrides,
    });
  }

  /**
   * Generates a duplicate Contact based on an existing Contact
   */
  public static createDuplicateContact(baseContact: Contact, overrides?: Partial<Contact>): Contact {
    return {
      firstName: baseContact.firstName,
      lastName: baseContact.lastName,
      email: baseContact.email,
      phone: baseContact.phone,
      company: baseContact.company,
      status: baseContact.status,
      ...overrides,
    };
  }

  /**
   * Generates an invalid Contact for negative testing scenarios
   */
  public static createInvalidContact(
    errorType: "missing_email" | "invalid_email" | "missing_first_name" | "missing_phone"
  ): Partial<Contact> {
    const base = this.createContact();
    switch (errorType) {
      case "missing_email":
        return { ...base, email: "" };
      case "invalid_email":
        return { ...base, email: "invalid-email-format.com" };
      case "missing_first_name":
        return { ...base, firstName: "" };
      case "missing_phone":
        return { ...base, phone: "" };
      default:
        return base;
    }
  }
}

// Keep helper functions for backward compatibility or simple usage
export const createContact = (overrides?: Partial<Contact>) => ContactFactory.createContact(overrides);
export const createCustomer = (overrides?: Partial<Contact>) => ContactFactory.createCustomer(overrides);
export const createDuplicateContact = (base: Contact) => ContactFactory.createDuplicateContact(base);
export const createInvalidContact = (type: any) => ContactFactory.createInvalidContact(type);
export const createHotLead = () => {}; // Stub for backward compatibility
export const createColdLead = () => {}; // Stub for backward compatibility
