import { CompletedInteraction, FollowUpScenario } from "../interfaces";
import { ContactFactory } from "./contactFactory";
import { ActionFactory } from "./actionFactory";
import { RandomUtils } from "../../utils/randomUtils";
import { DateUtils } from "../../utils/dateUtils";

/**
 * Factory class for generating Completed Interaction test data
 */
export class InteractionFactory {
  /**
   * Generates a completed interaction for a contact
   */
  public static createInteraction(
    contactId: string,
    overrides?: Partial<CompletedInteraction>
  ): CompletedInteraction {
    const type = RandomUtils.getRandomItem(["Call", "Email", "Meeting", "Note"]);
    const outcome = RandomUtils.getRandomItem(["Successful", "NoAnswer", "FollowUpRequired", "GeneralNote"]);
    const daysInPast = RandomUtils.getRandomNumber(1, 10);

    return {
      contactId,
      type,
      date: DateUtils.getFormattedPastDate(daysInPast, "YYYY-MM-DD HH:mm:ss"),
      notes: `Spoke to customer via ${type.toLowerCase()}. Outcome was: ${outcome.toLowerCase()}.`,
      outcome,
      ...overrides,
    };
  }

  /**
   * Generates a full Follow-up Scenario (Contact + completed Interaction + planned Follow-up Action)
   */
  public static createFollowUpScenario(overrides?: Partial<FollowUpScenario>): FollowUpScenario {
    // 1. Create a random contact
    const contact = ContactFactory.createContact(overrides?.contact);
    const contactId = contact.id || RandomUtils.getUUID();
    contact.id = contactId;

    // 2. Create a completed interaction that resulted in FollowUpRequired
    const completedInteraction = this.createInteraction(contactId, {
      type: "Call",
      outcome: "FollowUpRequired",
      notes: "Client interested in product, requested follow-up meeting next week.",
      ...overrides?.completedInteraction,
    });

    // 3. Create a planned action scheduled in the future for follow-up
    const plannedAction = ActionFactory.createAction(contactId, {
      type: "Meeting",
      title: "Follow-up Demo Meeting",
      dueDate: DateUtils.getFormattedFutureDate(7),
      description: "Discuss product requirements as requested in previous call.",
      status: "Planned",
      ...overrides?.plannedAction,
    });

    return {
      contact,
      completedInteraction,
      plannedAction,
    };
  }
}

// Helper functions for direct import usage
export const createInteraction = (contactId: string, overrides?: Partial<CompletedInteraction>) =>
  InteractionFactory.createInteraction(contactId, overrides);
export const createFollowUpScenario = (overrides?: Partial<FollowUpScenario>) =>
  InteractionFactory.createFollowUpScenario(overrides);
