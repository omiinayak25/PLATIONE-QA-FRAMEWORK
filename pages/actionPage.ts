import { Page, Locator } from "@playwright/test";
import { URLS } from "../config/urls";
import { BrowserHelper } from "../utils/browserHelper";
import { PlannedAction } from "../data/interfaces";
import { logger } from "../utils/logger";

/**
 * Page Object class representing the Action Management & Scheduling page
 */
export class ActionPage {
  private page: Page;

  // Search & List selectors
  public readonly createActionButton: Locator;
  public readonly actionRows: Locator;

  // Create Form selectors
  public readonly contactSelect: Locator;
  public readonly titleInput: Locator;
  public readonly typeSelect: Locator;
  public readonly dueDateInput: Locator;
  public readonly statusSelect: Locator;
  public readonly descriptionInput: Locator;
  public readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // List buttons
    this.createActionButton = page.locator("#createActionButton");
    this.actionRows = page.locator(".action-row");

    // Modal Form inputs
    this.contactSelect = page.locator("#actionContactSelect");
    this.titleInput = page.locator("#actionTitleInput");
    this.typeSelect = page.locator("#actionTypeSelect");
    this.dueDateInput = page.locator("#actionDueDateInput");
    this.statusSelect = page.locator("#actionStatusSelect");
    this.descriptionInput = page.locator("#actionDescriptionInput");
    this.saveButton = page.locator("#saveActionButton");
  }

  /**
   * Navigates directly to the Action Management page
   */
  public async navigate(): Promise<void> {
    await BrowserHelper.navigateTo(this.page, URLS.ACTIONS, "Action Management Page");
  }

  /**
   * Opens the action modal and seeds a new Planned Action
   */
  public async createAction(action: PlannedAction): Promise<void> {
    logger.info(`UI Action: Scheduling Action - ${action.title} for Contact: ${action.contactId}`);
    await BrowserHelper.click(this.page, this.createActionButton, "Open Action Scheduler modal");
    await this.contactSelect.selectOption({ value: action.contactId });
    await BrowserHelper.fill(this.page, this.titleInput, action.title, "Action Title field");
    await this.typeSelect.selectOption(action.type);
    await BrowserHelper.fill(this.page, this.dueDateInput, action.dueDate, "Due Date field");
    await this.statusSelect.selectOption(action.status);
    if (action.description) {
      await BrowserHelper.fill(this.page, this.descriptionInput, action.description, "Description field");
    }
    await BrowserHelper.click(this.page, this.saveButton, "Save Action button");
    await BrowserHelper.waitForNetworkIdle(this.page);
  }

  /**
   * Checks if an action with a specific title is visible in the list
   */
  public async isActionInList(title: string): Promise<boolean> {
    const row = this.page.locator(`.action-row:has-text("${title}")`);
    return BrowserHelper.isVisible(this.page, row);
  }

  /**
   * Updates an action's state to Completed from the list
   */
  public async markActionAsCompleted(title: string): Promise<void> {
    logger.info(`UI Action: Marking action completed - "${title}"`);
    const row = this.page.locator(`.action-row:has-text("${title}")`);
    const completeBtn = row.locator(".mark-complete-btn");
    await BrowserHelper.click(this.page, completeBtn, `Mark Complete button for action: ${title}`);
    await BrowserHelper.waitForNetworkIdle(this.page);
  }
}
