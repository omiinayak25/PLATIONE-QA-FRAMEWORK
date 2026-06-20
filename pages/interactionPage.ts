import { Page, Locator } from "@playwright/test";
import { BrowserHelper } from "../utils/browserHelper";
import { CompletedInteraction } from "../data/interfaces";
import { logger } from "../utils/logger";
import { ENV } from "../config/env";

/**
 * Page Object class representing the Interactions Logger and Timeline interface
 */
export class InteractionPage {
  private page: Page;

  // List & timeline selectors
  public readonly logInteractionButton: Locator;
  public readonly timelineItems: Locator;

  // Create Form selectors
  public readonly contactSelect: Locator;
  public readonly typeSelect: Locator;
  public readonly dateInput: Locator;
  public readonly outcomeSelect: Locator;
  public readonly notesInput: Locator;
  public readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Timeline elements
    this.logInteractionButton = page.locator("#logInteractionButton");
    this.timelineItems = page.locator(".timeline-item");

    // Modal Form inputs
    this.contactSelect = page.locator("#interactionContactSelect");
    this.typeSelect = page.locator("#interactionTypeSelect");
    this.dateInput = page.locator("#interactionDateInput");
    this.outcomeSelect = page.locator("#interactionOutcomeSelect");
    this.notesInput = page.locator("#interactionNotesInput");
    this.saveButton = page.locator("#saveInteractionButton");
  }

  /**
   * Navigates to the general activity timeline/interactions page
   */
  public async navigate(): Promise<void> {
    const url = `${ENV.getBaseUrl()}/interactions`;
    await BrowserHelper.navigateTo(this.page, url, "Interactions Timeline Page");
  }

  /**
   * Navigates to a specific Contact's details/timeline page
   */
  public async navigateToContactTimeline(contactId: string): Promise<void> {
    const url = `${ENV.getBaseUrl()}/contacts/${contactId}/timeline`;
    await BrowserHelper.navigateTo(this.page, url, `Contact ${contactId} Timeline Page`);
  }

  /**
   * Logs a new interaction via the UI modal
   */
  public async logInteraction(interaction: CompletedInteraction): Promise<void> {
    logger.info(`UI Action: Logging Interaction - Contact: ${interaction.contactId}, Type: ${interaction.type}`);
    await BrowserHelper.click(this.page, this.logInteractionButton, "Open Interaction Modal button");
    await this.contactSelect.selectOption({ value: interaction.contactId });
    await this.typeSelect.selectOption(interaction.type);
    await BrowserHelper.fill(this.page, this.dateInput, interaction.date, "Interaction Date field");
    await this.outcomeSelect.selectOption(interaction.outcome);
    await BrowserHelper.fill(this.page, this.notesInput, interaction.notes, "Notes text field");
    await BrowserHelper.click(this.page, this.saveButton, "Save Interaction button");
    await BrowserHelper.waitForNetworkIdle(this.page);
  }

  /**
   * Checks if an interaction note is visible in the timeline list
   */
  public async isInteractionInTimeline(notes: string): Promise<boolean> {
    const timelineItem = this.page.locator(`.timeline-item:has-text("${notes}")`);
    return BrowserHelper.isVisible(this.page, timelineItem);
  }
}
