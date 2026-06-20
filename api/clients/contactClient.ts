import { APIRequestContext, APIResponse } from "@playwright/test";
import { ApiHelper } from "../../utils/apiHelper";
import { TokenManager } from "../auth/tokenManager";
import { API_ENDPOINTS } from "../../config/urls";
import { Contact } from "../../data/interfaces";
import { logger } from "../../utils/logger";

/**
 * REST Client for managing Contact endpoints
 */
export class ContactClient {
  private api: ApiHelper;

  constructor(request: APIRequestContext, token?: string) {
    this.api = new ApiHelper(request, token);
  }

  /**
   * Static factory method to instantiate ContactClient with a retrieved session token
   */
  public static async create(request: APIRequestContext): Promise<ContactClient> {
    const token = await TokenManager.getInstance().getToken(request);
    return new ContactClient(request, token);
  }

  /**
   * Creates a new Contact
   */
  public async createContact(contact: Contact): Promise<APIResponse> {
    logger.info(`API Request: Create Contact - ${contact.firstName} ${contact.lastName}`);
    return this.api.post(API_ENDPOINTS.CONTACTS, contact);
  }

  /**
   * Retrieves a Contact by ID
   */
  public async getContact(id: string): Promise<APIResponse> {
    logger.info(`API Request: Get Contact ID - ${id}`);
    return this.api.get(`${API_ENDPOINTS.CONTACTS}/${id}`);
  }

  /**
   * Retrieves all Contacts
   */
  public async getContacts(): Promise<APIResponse> {
    logger.info("API Request: Get All Contacts");
    return this.api.get(API_ENDPOINTS.CONTACTS);
  }

  /**
   * Updates an existing Contact by ID
   */
  public async updateContact(id: string, contact: Partial<Contact>): Promise<APIResponse> {
    logger.info(`API Request: Update Contact ID - ${id}`);
    return this.api.put(`${API_ENDPOINTS.CONTACTS}/${id}`, contact);
  }

  /**
   * Deletes a Contact by ID
   */
  public async deleteContact(id: string): Promise<APIResponse> {
    logger.info(`API Request: Delete Contact ID - ${id}`);
    return this.api.delete(`${API_ENDPOINTS.CONTACTS}/${id}`);
  }
}
