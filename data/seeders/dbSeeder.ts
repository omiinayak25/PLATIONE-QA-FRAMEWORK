import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";
import { EnvironmentHelper } from "../../utils/environment";
import { Contact, PlannedAction, CompletedInteraction } from "../interfaces";
import { logger } from "../../utils/logger";

import { RandomUtils as CustomRandom } from "../../utils/randomUtils";

/**
 * Seeder class for creating and cleaning up test data directly in MySQL
 */
export class DbSeeder {
  private pool: mysql.Pool | null = null;
  private isMockMode = false;

  private seededContactIds: string[] = [];
  private seededActionIds: string[] = [];
  private seededInteractionIds: string[] = [];

  constructor() {
    this.initializeConnection();
  }

  /**
   * Initializes the MySQL connection pool
   * Switches to Mock Mode if database is unreachable (ideal for local offline development)
   */
  private async initializeConnection(): Promise<void> {
    try {
      const config = {
        host: EnvironmentHelper.getDbHost(),
        port: EnvironmentHelper.getDbPort(),
        user: EnvironmentHelper.getDbUser(),
        password: EnvironmentHelper.getDbPassword(),
        database: EnvironmentHelper.getDbName(),
        connectionLimit: 5,
        connectTimeout: 5000,
      };

      logger.info(`Connecting to MySQL database at ${config.host}:${config.port}...`);
      this.pool = mysql.createPool(config);
      // Test connection
      const connection = await this.pool.getConnection();
      connection.release();
      logger.info("Successfully connected to MySQL database.");
    } catch (err) {
      logger.warn(`MySQL Database not reachable: ${(err as Error).message}. Switched to offline Mock Database Seeder.`);
      this.isMockMode = true;
      this.pool = null;
    }
  }

  /**
   * Helper method to execute query on the database
   */
  public async executeQuery(sql: string, params: any[] = []): Promise<any> {
    if (this.isMockMode || !this.pool) {
      logger.debug(`[MOCK DB] Executing: ${sql} | Params: ${JSON.stringify(params)}`);
      return [{ affectedRows: 1, insertId: 1 }];
    }

    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (err) {
      logger.error(`Database query failed: ${sql}`, err as Error);
      throw err;
    }
  }

  /**
   * Reads a SQL migration script and runs all statements
   */
  public async executeSqlScript(filePath: string): Promise<void> {
    const absolutePath = path.resolve(filePath);
    logger.info(`Executing SQL script: ${absolutePath}`);
    try {
      const sqlContent = fs.readFileSync(absolutePath, "utf-8");
      const statements = sqlContent
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        await this.executeQuery(statement);
      }
      logger.info(`Successfully executed script: ${absolutePath}`);
    } catch (err) {
      logger.error(`Failed to execute SQL script ${absolutePath}:`, err as Error);
      throw err;
    }
  }

  /**
   * Seeds a Contact record into the contacts table
   */
  public async seedContact(contact: Contact): Promise<Contact> {
    const id = contact.id || CustomRandom.getUUID();
    logger.info(`Direct DB Seed: Contact ${contact.firstName} ${contact.lastName} (ID: ${id})`);

    const sql = `
      INSERT INTO contacts (id, first_name, last_name, email, phone, company, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [id, contact.firstName, contact.lastName, contact.email, contact.phone, contact.company, contact.status];

    await this.executeQuery(sql, params);
    this.seededContactIds.push(id);
    return { ...contact, id };
  }

  /**
   * Seeds a Planned Action record into the planned_actions table
   */
  public async seedAction(action: PlannedAction): Promise<PlannedAction> {
    const id = action.id || CustomRandom.getUUID();
    logger.info(`Direct DB Seed: Planned Action ${action.title} (ID: ${id})`);

    const sql = `
      INSERT INTO planned_actions (id, contact_id, title, type, due_date, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [id, action.contactId, action.title, action.type, action.dueDate, action.status, action.description || null];

    await this.executeQuery(sql, params);
    this.seededActionIds.push(id);
    return { ...action, id };
  }

  /**
   * Seeds a Completed Interaction record into the completed_interactions table
   */
  public async seedInteraction(interaction: CompletedInteraction): Promise<CompletedInteraction> {
    const id = interaction.id || CustomRandom.getUUID();
    logger.info(`Direct DB Seed: Completed Interaction for contact ID ${interaction.contactId} (ID: ${id})`);

    const sql = `
      INSERT INTO completed_interactions (id, contact_id, type, date, notes, outcome)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [id, interaction.contactId, interaction.type, interaction.date, interaction.notes, interaction.outcome];

    await this.executeQuery(sql, params);
    this.seededInteractionIds.push(id);
    return { ...interaction, id };
  }

  /**
   * Deletes all direct DB seeded records in reverse topological order (Interactions -> Actions -> Contacts)
   */
  public async cleanup(): Promise<void> {
    logger.info("Starting Direct DB test data cleanup rollbacks...");

    for (const id of this.seededInteractionIds) {
      await this.executeQuery("DELETE FROM completed_interactions WHERE id = ?", [id]);
    }
    this.seededInteractionIds = [];

    for (const id of this.seededActionIds) {
      await this.executeQuery("DELETE FROM planned_actions WHERE id = ?", [id]);
    }
    this.seededActionIds = [];

    for (const id of this.seededContactIds) {
      await this.executeQuery("DELETE FROM contacts WHERE id = ?", [id]);
    }
    this.seededContactIds = [];

    logger.info("Direct DB test data rollback successfully completed.");
  }

  /**
   * Closes database pools on test teardown
   */
  public async closeConnection(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      logger.info("MySQL Connection pool closed.");
    }
  }
}
