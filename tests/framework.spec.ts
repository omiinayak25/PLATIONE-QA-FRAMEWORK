import { test, expect } from "@playwright/test";
import { ENV } from "../config/env";

test("Verify Environment Configuration", async ({ page }) => {
  console.log("Base URL:", ENV.getBaseUrl());
  console.log("API URL:", ENV.getApiUrl());
  console.log("Username:", ENV.getUsername());

  expect(ENV.getBaseUrl()).toBeTruthy();
  expect(ENV.getApiUrl()).toBeTruthy();
});
