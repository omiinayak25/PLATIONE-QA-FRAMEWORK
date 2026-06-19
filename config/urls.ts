import { ENV } from "./env";

/**
 * Application URLs
 */

export const URLS = {
  LOGIN: `${ENV.getBaseUrl()}/login`,

  DASHBOARD: `${ENV.getBaseUrl()}/dashboard`,

  CONTACTS: `${ENV.getBaseUrl()}/contacts`,

  LEADS: `${ENV.getBaseUrl()}/leads`,

  ACTIONS: `${ENV.getBaseUrl()}/actions`,
};

/**
 * API Endpoints
 */

export const API_ENDPOINTS = {
  LOGIN: `${ENV.getApiUrl()}/auth/login`,

  CONTACTS: `${ENV.getApiUrl()}/contacts`,

  LEADS: `${ENV.getApiUrl()}/leads`,

  ACTIONS: `${ENV.getApiUrl()}/actions`,

  INTERACTIONS: `${ENV.getApiUrl()}/interactions`,
};
