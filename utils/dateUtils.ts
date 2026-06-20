import { CONSTANTS } from "../config/constants";

/**
 * Utility class for date manipulation and formatting
 */
export class DateUtils {
  /**
   * Formats a Date object into a string
   * Default format is YYYY-MM-DD
   */
  public static formatDate(date: Date, format: string = CONSTANTS.DATE_FORMAT): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return format
      .replace("YYYY", String(year))
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);
  }

  /**
   * Returns a date object representing N days in the future
   */
  public static getFutureDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  /**
   * Returns a date object representing N days in the past
   */
  public static getPastDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  /**
   * Returns a formatted string representing N days in the future
   */
  public static getFormattedFutureDate(days: number, format: string = CONSTANTS.DATE_FORMAT): string {
    return this.formatDate(this.getFutureDate(days), format);
  }

  /**
   * Returns a formatted string representing N days in the past
   */
  public static getFormattedPastDate(days: number, format: string = CONSTANTS.DATE_FORMAT): string {
    return this.formatDate(this.getPastDate(days), format);
  }

  /**
   * Returns the current date formatted as a string
   */
  public static getCurrentFormattedDate(format: string = CONSTANTS.DATE_FORMAT): string {
    return this.formatDate(new Date(), format);
  }

  /**
   * Validates if a string represents a valid date
   */
  public static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
