import { APIRequestContext, APIResponse } from "@playwright/test";
import { ApiHelper } from "../../utils/apiHelper";
import { TokenManager } from "../auth/tokenManager";
import { API_ENDPOINTS } from "../../config/urls";
import { PlannedAction } from "../../data/interfaces";
import { logger } from "../../utils/logger";

/**
 * REST Client for managing Planned Action endpoints
 */
export class ActionClient {
  private api: ApiHelper;

  constructor(request: APIRequestContext, token?: string) {
    this.api = new ApiHelper(request, token);
  }

  /**
   * Static factory method to instantiate ActionClient with a retrieved session token
   */
  public static async create(request: APIRequestContext): Promise<ActionClient> {
    const token = await TokenManager.getInstance().getToken(request);
    return new ActionClient(request, token);
  }

  /**
   * Creates a new Planned Action
   */
  public async createAction(action: PlannedAction): Promise<APIResponse> {
    logger.info(`API Request: Create Action - ${action.title}`);
    return this.api.post(API_ENDPOINTS.ACTIONS, action);
  }

  /**
   * Retrieves a Planned Action by ID
   */
  public async getAction(id: string): Promise<APIResponse> {
    logger.info(`API Request: Get Action ID - ${id}`);
    return this.api.get(`${API_ENDPOINTS.ACTIONS}/${id}`);
  }

  /**
   * Retrieves all Planned Actions
   */
  public async getActions(): Promise<APIResponse> {
    logger.info("API Request: Get All Actions");
    return this.api.get(API_ENDPOINTS.ACTIONS);
  }

  /**
   * Updates status of an Action (e.g. from Planned to Completed)
   */
  public async updateActionStatus(id: string, status: "Planned" | "Completed" | "Cancelled"): Promise<APIResponse> {
    logger.info(`API Request: Update Action Status - ID: ${id} to ${status}`);
    return this.api.put(`${API_ENDPOINTS.ACTIONS}/${id}`, { status });
  }

  /**
   * Deletes a Planned Action by ID
   */
  public async deleteAction(id: string): Promise<APIResponse> {
    logger.info(`API Request: Delete Action ID - ${id}`);
    return this.api.delete(`${API_ENDPOINTS.ACTIONS}/${id}`);
  }
}
