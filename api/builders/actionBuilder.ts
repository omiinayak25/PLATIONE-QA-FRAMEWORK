import { PlannedAction } from "../../data/interfaces";
import { ActionFactory } from "../../data/factories/actionFactory";

/**
 * Fluent Builder class for customizing Planned Action test data models
 */
export class ActionBuilder {
  private action: PlannedAction;

  constructor(contactId: string) {
    // Initialize with valid default values from ActionFactory
    this.action = ActionFactory.createAction(contactId);
  }

  /**
   * Sets the contact ID
   */
  public withContactId(contactId: string): this {
    this.action.contactId = contactId;
    return this;
  }

  /**
   * Sets activity title
   */
  public withTitle(title: string): this {
    this.action.title = title;
    return this;
  }

  /**
   * Sets action type
   */
  public withType(type: "Call" | "Email" | "Meeting" | "FollowUp"): this {
    this.action.type = type;
    return this;
  }

  /**
   * Sets task due date (YYYY-MM-DD)
   */
  public withDueDate(dueDate: string): this {
    this.action.dueDate = dueDate;
    return this;
  }

  /**
   * Sets action status
   */
  public withStatus(status: "Planned" | "Completed" | "Cancelled"): this {
    this.action.status = status;
    return this;
  }

  /**
   * Sets custom description details
   */
  public withDescription(description: string): this {
    this.action.description = description;
    return this;
  }

  /**
   * Builds and returns the customized PlannedAction object
   */
  public build(): PlannedAction {
    return this.action;
  }
}
