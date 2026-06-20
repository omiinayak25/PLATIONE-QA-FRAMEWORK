import { APIRequestContext, APIResponse } from "@playwright/test";
import { ApiHelper } from "../../utils/apiHelper";
import { TokenManager } from "../auth/tokenManager";
import { API_ENDPOINTS } from "../../config/urls";
import { CompletedInteraction } from "../../data/interfaces";
import { logger } from "../../utils/logger";

/**
 * REST Client for managing Completed Interaction endpoints
 */
export class InteractionClient {
  private api: ApiHelper;

  constructor(request: APIRequestContext, token?: string) {
    this.api = new ApiHelper(request, token);
  }

  /**
   * Static factory method to instantiate InteractionClient with a retrieved session token
   */
  public static async create(request: APIRequestContext): Promise<InteractionClient> {
    const token = await TokenManager.getInstance().getToken(request);
    return new InteractionClient(request, token);
  }

  /**
   * Creates a new Completed Interaction record
   */
  public async createInteraction(interaction: CompletedInteraction): Promise<APIResponse> {
    logger.info(`API Request: Create Completed Interaction - Contact: ${interaction.contactId}`);
    return this.api.post(API_ENDPOINTS.INTERACTIONS, interaction);
  }

  /**
   * Retrieves an Interaction by ID
   */
  public async getInteraction(id: string): Promise<APIResponse> {
    logger.info(`API Request: Get Interaction ID - ${id}`);
    return this.api.get(`${API_ENDPOINTS.INTERACTIONS}/${id}`);
  }

  /**
   * Retrieves all Interactions
   */
  public async getInteractions(): Promise<APIResponse> {
    logger.info("API Request: Get All Interactions");
    return this.api.get(API_ENDPOINTS.INTERACTIONS);
  }

  /**
   * Deletes an Interaction by ID
   */
  public async deleteInteraction(id: string): Promise<APIResponse> {
    logger.info(`API Request: Delete Interaction ID - ${id}`);
    return this.api.delete(`${API_ENDPOINTS.INTERACTIONS}/${id}`);
  }
}
