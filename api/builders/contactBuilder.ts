import { Contact } from "../../data/interfaces";
import { ContactFactory } from "../../data/factories/contactFactory";

/**
 * Fluent Builder class for customizing Contact test data models
 */
export class ContactBuilder {
  private contact: Contact;

  constructor() {
    // Initialize with valid default values from ContactFactory
    this.contact = ContactFactory.createContact();
  }

  /**
   * Sets first name
   */
  public withFirstName(firstName: string): this {
    this.contact.firstName = firstName;
    return this;
  }

  /**
   * Sets last name
   */
  public withLastName(lastName: string): this {
    this.contact.lastName = lastName;
    return this;
  }

  /**
   * Sets email address
   */
  public withEmail(email: string): this {
    this.contact.email = email;
    return this;
  }

  /**
   * Sets phone number
   */
  public withPhone(phone: string): this {
    this.contact.phone = phone;
    return this;
  }

  /**
   * Sets company name
   */
  public withCompany(company: string): this {
    this.contact.company = company;
    return this;
  }

  /**
   * Sets contact status
   */
  public withStatus(status: "Active" | "Inactive" | "Customer"): this {
    this.contact.status = status;
    return this;
  }

  /**
   * Builds and returns the customized Contact object
   */
  public build(): Contact {
    return this.contact;
  }
}
