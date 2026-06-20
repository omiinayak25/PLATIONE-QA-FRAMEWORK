import { APIRequestContext } from "@playwright/test";
import { ContactClient } from "../../api/clients/contactClient";
import { ActionClient } from "../../api/clients/actionClient";
import { InteractionClient } from "../../api/clients/interactionClient";
import { Contact, PlannedAction, CompletedInteraction } from "../interfaces";
import { logger } from "../../utils/logger";

/**
 * Seeder class for creating and cleaning up test data via REST APIs
 */
export class ApiSeeder {
  private contactClient: ContactClient;
  private actionClient: ActionClient;
  private interactionClient: InteractionClient;

  private seededContactIds: string[] = [];
  private seededActionIds: string[] = [];
  private seededInteractionIds: string[] = [];

  constructor(contactClient: ContactClient, actionClient: ActionClient, interactionClient: InteractionClient) {
    this.contactClient = contactClient;
    this.actionClient = actionClient;
    this.interactionClient = interactionClient;
  }

  /**
   * Static factory to instantiate ApiSeeder autowiring the API Clients
   */
  public static async create(request: APIRequestContext): Promise<ApiSeeder> {
    const contactClient = await ContactClient.create(request);
    const actionClient = await ActionClient.create(request);
    const interactionClient = await InteractionClient.create(request);
    return new ApiSeeder(contactClient, actionClient, interactionClient);
  }

  /**
   * Seeds a Contact record and tracks its ID for cleanup
   */
  public async seedContact(contact: Contact): Promise<Contact> {
    logger.info(`Seeding Contact via API: ${contact.firstName} ${contact.lastName}`);
    const response = await this.contactClient.createContact(contact);
    if (!response.ok()) {
      throw new Error(`Failed to seed contact. Status: ${response.status()} ${response.statusText()}`);
    }
    const body = await response.json();
    const id = body.id || `mock-id-${Date.now()}`;
    this.seededContactIds.push(id);
    return { ...contact, id };
  }

  /**
   * Seeds a Planned Action record and tracks its ID for cleanup
   */
  public async seedAction(action: PlannedAction): Promise<PlannedAction> {
    logger.info(`Seeding Action via API: ${action.title}`);
    const response = await this.actionClient.createAction(action);
    if (!response.ok()) {
      throw new Error(`Failed to seed action. Status: ${response.status()} ${response.statusText()}`);
    }
    const body = await response.json();
    const id = body.id || `mock-id-${Date.now()}`;
    this.seededActionIds.push(id);
    return { ...action, id };
  }

  /**
   * Seeds a Completed Interaction record and tracks its ID for cleanup
   */
  public async seedInteraction(interaction: CompletedInteraction): Promise<CompletedInteraction> {
    logger.info(`Seeding Interaction via API: Contact ID ${interaction.contactId}`);
    const response = await this.interactionClient.createInteraction(interaction);
    if (!response.ok()) {
      throw new Error(`Failed to seed interaction. Status: ${response.status()} ${response.statusText()}`);
    }
    const body = await response.json();
    const id = body.id || `mock-id-${Date.now()}`;
    this.seededInteractionIds.push(id);
    return { ...interaction, id };
  }

  /**
   * Deletes all seeded records in reverse topological order (Interactions -> Actions -> Contacts)
   */
  public async cleanup(): Promise<void> {
    logger.info("Starting API-driven test data cleanup tear-down process...");

    // Delete interactions first to satisfy relational DB constraints
    for (const id of this.seededInteractionIds) {
      try {
        await this.interactionClient.deleteInteraction(id);
        logger.info(`Successfully cleaned up Interaction ID: ${id}`);
      } catch (err) {
        logger.warn(`Cleanup failed for Interaction ID ${id}: ${(err as Error).message}`);
      }
    }
    this.seededInteractionIds = [];

    // Delete planned actions next
    for (const id of this.seededActionIds) {
      try {
        await this.actionClient.deleteAction(id);
        logger.info(`Successfully cleaned up Action ID: ${id}`);
      } catch (err) {
        logger.warn(`Cleanup failed for Action ID ${id}: ${(err as Error).message}`);
      }
    }
    this.seededActionIds = [];

    // Delete contacts last
    for (const id of this.seededContactIds) {
      try {
        await this.contactClient.deleteContact(id);
        logger.info(`Successfully cleaned up Contact ID: ${id}`);
      } catch (err) {
        logger.warn(`Cleanup failed for Contact ID ${id}: ${(err as Error).message}`);
      }
    }
    this.seededContactIds = [];

    logger.info("API-driven test data cleanup successfully completed.");
  }
}
