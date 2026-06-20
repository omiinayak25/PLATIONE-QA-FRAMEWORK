/**
 * Interface representing a Contact in Platione Sales Assist
 */
export interface Contact {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: "Active" | "Inactive" | "Customer";
}

/**
 * Interface representing a Lead in Platione Sales Assist
 */
export interface Lead {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: "New" | "Contacted" | "Qualified" | "Lost" | "Converted";
  temperature: "Hot" | "Warm" | "Cold";
  leadScore: number;
}

/**
 * Interface representing a Planned Action
 */
export interface PlannedAction {
  id?: string;
  contactId: string;
  title: string;
  type: "Call" | "Email" | "Meeting" | "FollowUp";
  dueDate: string; // YYYY-MM-DD format
  status: "Planned" | "Completed" | "Cancelled";
  description?: string;
}

/**
 * Interface representing a Completed Interaction
 */
export interface CompletedInteraction {
  id?: string;
  contactId: string;
  type: "Call" | "Email" | "Meeting" | "Note";
  date: string; // YYYY-MM-DD HH:mm:ss format
  notes: string;
  outcome: "Successful" | "NoAnswer" | "FollowUpRequired" | "GeneralNote";
}

/**
 * Interface representing a Follow-up Scenario (business flow context)
 */
export interface FollowUpScenario {
  contact: Contact;
  plannedAction: PlannedAction;
  completedInteraction: CompletedInteraction;
}
