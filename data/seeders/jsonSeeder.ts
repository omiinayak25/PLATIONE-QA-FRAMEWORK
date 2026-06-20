import * as fs from "fs";
import * as path from "path";
import { Contact, PlannedAction, CompletedInteraction } from "../interfaces";
import { logger } from "../../utils/logger";

/**
 * Seeder class for parsing and loading static seed data from JSON files
 */
export class JsonSeeder {
  /**
   * Loads Contact records from a static JSON file
   */
  public static loadContacts(filePath: string): Contact[] {
    const absolutePath = path.resolve(filePath);
    logger.info(`Loading Contacts from JSON file: ${absolutePath}`);
    try {
      const content = fs.readFileSync(absolutePath, "utf-8");
      return JSON.parse(content) as Contact[];
    } catch (err) {
      logger.error(`Failed to read/parse Contacts from JSON file ${absolutePath}:`, err as Error);
      throw err;
    }
  }

  /**
   * Loads Planned Action records from a static JSON file
   */
  public static loadActions(filePath: string): PlannedAction[] {
    const absolutePath = path.resolve(filePath);
    logger.info(`Loading Actions from JSON file: ${absolutePath}`);
    try {
      const content = fs.readFileSync(absolutePath, "utf-8");
      return JSON.parse(content) as PlannedAction[];
    } catch (err) {
      logger.error(`Failed to read/parse Actions from JSON file ${absolutePath}:`, err as Error);
      throw err;
    }
  }

  /**
   * Loads Completed Interaction records from a static JSON file
   */
  public static loadInteractions(filePath: string): CompletedInteraction[] {
    const absolutePath = path.resolve(filePath);
    logger.info(`Loading Interactions from JSON file: ${absolutePath}`);
    try {
      const content = fs.readFileSync(absolutePath, "utf-8");
      return JSON.parse(content) as CompletedInteraction[];
    } catch (err) {
      logger.error(`Failed to read/parse Interactions from JSON file ${absolutePath}:`, err as Error);
      throw err;
    }
  }
}
