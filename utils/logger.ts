/**
 * Logger Severity Levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Standard Logger Class for the Platione QA Automation Framework
 */
class Logger {
  private currentLogLevel: LogLevel = LogLevel.INFO;

  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    if (envLevel && envLevel in LogLevel) {
      this.currentLogLevel = LogLevel[envLevel as keyof typeof LogLevel];
    }
  }

  /**
   * Set log level dynamically
   */
  public setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  /**
   * Format message with timestamp and level
   */
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  /**
   * Log debug messages
   */
  public debug(message: string): void {
    if (this.currentLogLevel <= LogLevel.DEBUG) {
      console.log(this.formatMessage("DEBUG", message));
    }
  }

  /**
   * Log info messages
   */
  public info(message: string): void {
    if (this.currentLogLevel <= LogLevel.INFO) {
      console.log(this.formatMessage("INFO", message));
    }
  }

  /**
   * Log warning messages
   */
  public warn(message: string): void {
    if (this.currentLogLevel <= LogLevel.WARN) {
      console.warn(this.formatMessage("WARN", message));
    }
  }

  /**
   * Log error messages
   */
  public error(message: string, error?: Error): void {
    if (this.currentLogLevel <= LogLevel.ERROR) {
      const errDetail = error ? ` - Stack: ${error.stack || error.message}` : "";
      console.error(this.formatMessage("ERROR", `${message}${errDetail}`));
    }
  }
}

export const logger = new Logger();
