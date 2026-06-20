import { test, expect } from "@playwright/test";
import { logger } from "../utils/logger";
import { RandomUtils } from "../utils/randomUtils";
import { DateUtils } from "../utils/dateUtils";
import { ApiHelper } from "../utils/apiHelper";

test.describe("Framework Utilities Verification", () => {
  test("Logger should log messages without throwing exceptions", () => {
    expect(() => logger.info("Testing info log message")).not.toThrow();
    expect(() => logger.debug("Testing debug log message")).not.toThrow();
    expect(() => logger.warn("Testing warning log message")).not.toThrow();
    expect(() => logger.error("Testing error log message", new Error("Sample error"))).not.toThrow();
  });

  test("RandomUtils should generate expected patterns", () => {
    // Alphanumeric string
    const randStr = RandomUtils.getRandomString(12);
    expect(randStr.length).toBe(12);
    expect(typeof randStr).toBe("string");

    // Email
    const randEmail = RandomUtils.getRandomEmail("user");
    expect(randEmail).toContain("user_");
    expect(randEmail).toContain("@plationetest.com");

    // Phone
    const randPhone = RandomUtils.getRandomPhone();
    expect(randPhone.startsWith("+1")).toBe(true);
    expect(randPhone.length).toBe(12); // +1 and 10 digits

    // Name
    const firstName = RandomUtils.getRandomFirstName();
    const lastName = RandomUtils.getRandomLastName();
    expect(firstName).toBeTruthy();
    expect(lastName).toBeTruthy();

    // Random items selection
    const items = ["A", "B", "C"];
    const item = RandomUtils.getRandomItem(items);
    expect(items).toContain(item);
  });

  test("DateUtils should format and compute dates correctly", () => {
    const today = DateUtils.getCurrentFormattedDate("YYYY-MM-DD");
    expect(DateUtils.isValidDate(today)).toBe(true);
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const futureDate = DateUtils.getFormattedFutureDate(5, "YYYY-MM-DD");
    expect(DateUtils.isValidDate(futureDate)).toBe(true);

    const pastDate = DateUtils.getFormattedPastDate(5, "YYYY-MM-DD");
    expect(DateUtils.isValidDate(pastDate)).toBe(true);

    // Verify difference roughly in days
    const diffTime = new Date(futureDate).getTime() - new Date(pastDate).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(10);
  });

  test("ApiHelper wrapper configuration", async ({ request }) => {
    const api = new ApiHelper(request, "test-token");
    expect(api).toBeDefined();
    // Verify that requests can be prepared
  });
});
