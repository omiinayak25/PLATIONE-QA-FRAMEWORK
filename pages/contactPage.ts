import { Page, Locator } from "@playwright/test";
import { URLS } from "../config/urls";
import { BrowserHelper } from "../utils/browserHelper";
import { Contact } from "../data/interfaces";
import { logger } from "../utils/logger";

/**
 * Page Object class representing the Contacts Management screen
 */
export class ContactPage {
  private page: Page;

  // Search & List selectors
  public readonly searchInput: Locator;
  public readonly createContactButton: Locator;
  public readonly contactRows: Locator;

  // Create Form selectors
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly emailInput: Locator;
  public readonly phoneInput: Locator;
  public readonly companyInput: Locator;
  public readonly statusSelect: Locator;
  public readonly saveButton: Locator;
  public readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Table & List UI
    this.searchInput = page.locator("#contactSearchInput");
    this.createContactButton = page.locator("#createContactButton");
    this.contactRows = page.locator(".contact-row");

    // Modal Form inputs
    this.firstNameInput = page.locator("#firstNameInput");
    this.lastNameInput = page.locator("#lastNameInput");
    this.emailInput = page.locator("#emailInput");
    this.phoneInput = page.locator("#phoneInput");
    this.companyInput = page.locator("#companyInput");
    this.statusSelect = page.locator("#statusSelect");
    this.saveButton = page.locator("#saveContactButton");
    this.cancelButton = page.locator("#cancelContactButton");
  }

  /**
   * Navigates directly to the Contacts management page
   */
  public async navigate(): Promise<void> {
    await BrowserHelper.navigateTo(this.page, URLS.CONTACTS, "Contacts Management Page");
  }

  /**
   * Fills contact details in the creation modal and submits
   */
  public async createContact(contact: Contact): Promise<void> {
    logger.info(`UI Action: Creating Contact - ${contact.firstName} ${contact.lastName}`);
    await BrowserHelper.click(this.page, this.createContactButton, "Open Contact Modal button");
    await BrowserHelper.fill(this.page, this.firstNameInput, contact.firstName, "First Name field");
    await BrowserHelper.fill(this.page, this.lastNameInput, contact.lastName, "Last Name field");
    await BrowserHelper.fill(this.page, this.emailInput, contact.email, "Email field");
    await BrowserHelper.fill(this.page, this.phoneInput, contact.phone, "Phone field");
    await BrowserHelper.fill(this.page, this.companyInput, contact.company, "Company field");
    await this.statusSelect.selectOption(contact.status);
    await BrowserHelper.click(this.page, this.saveButton, "Save Contact button");
    await BrowserHelper.waitForNetworkIdle(this.page);
  }

  /**
   * Searches for a contact via the filter search bar
   */
  public async searchContact(query: string): Promise<void> {
    logger.info(`UI Action: Searching Contacts with query: "${query}"`);
    await BrowserHelper.fill(this.page, this.searchInput, query, "Contact Search field");
    await this.page.press("#contactSearchInput", "Enter");
    await BrowserHelper.waitForNetworkIdle(this.page);
  }

  /**
   * Returns true if a contact with matching email is listed on the page
   */
  public async isContactInList(email: string): Promise<boolean> {
    const contactRow = this.page.locator(`.contact-row:has-text("${email}")`);
    return BrowserHelper.isVisible(this.page, contactRow);
  }

  /**
   * Deletes a contact matching the email from the list
   */
  public async deleteContact(email: string): Promise<void> {
    logger.info(`UI Action: Deleting Contact with email: ${email}`);
    const row = this.page.locator(`.contact-row:has-text("${email}")`);
    const deleteBtn = row.locator(".delete-contact-btn");
    await BrowserHelper.click(this.page, deleteBtn, `Delete button for contact email: ${email}`);
    await BrowserHelper.waitForNetworkIdle(this.page);
  }
}
