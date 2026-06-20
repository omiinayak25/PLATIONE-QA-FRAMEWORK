import { PlannedAction } from "../interfaces";
import { RandomUtils } from "../../utils/randomUtils";
import { DateUtils } from "../../utils/dateUtils";

/**
 * Factory class for generating Planned Action test data
 */
export class ActionFactory {
  /**
   * Generates a valid Planned Action for a contact
   */
  public static createAction(contactId: string, overrides?: Partial<PlannedAction>): PlannedAction {
    const type = RandomUtils.getRandomItem(["Call", "Email", "Meeting", "FollowUp"]);
    const daysInFuture = RandomUtils.getRandomNumber(1, 14);

    return {
      contactId,
      title: `${type} with Contact`,
      type,
      dueDate: DateUtils.getFormattedFutureDate(daysInFuture),
      status: "Planned",
      description: `Automatically scheduled planned ${type.toLowerCase()} activity.`,
      ...overrides,
    };
  }
}

// Helper function for direct import usage
export const createAction = (contactId: string, overrides?: Partial<PlannedAction>) =>
  ActionFactory.createAction(contactId, overrides);
