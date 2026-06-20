import { Page, Locator } from "@playwright/test";
import { BrowserHelper } from "../utils/browserHelper";

/**
 * Component object representing the Navigation Topbar
 */
export class NavbarComponent {
  private page: Page;
  public readonly container: Locator;
  public readonly logoLink: Locator;
  public readonly notificationsIcon: Locator;
  public readonly userProfileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator("#navbar-container");
    this.logoLink = this.container.locator(".logo-brand");
    this.notificationsIcon = this.container.locator(".notifications-bell");
    this.userProfileMenu = this.container.locator(".user-profile-avatar");
  }

  /**
   * Clicks notifications to toggle notification dropdown popup
   */
  public async toggleNotifications(): Promise<void> {
    await BrowserHelper.click(this.page, this.notificationsIcon, "Navbar Notifications Bell");
  }
}

/**
 * Component object representing the Navigation Sidebar links
 */
export class SidebarComponent {
  private page: Page;
  public readonly container: Locator;
  public readonly dashboardLink: Locator;
  public readonly contactsLink: Locator;
  public readonly actionsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator("#sidebar-container");
    this.dashboardLink = this.container.locator(".nav-link:has-text('Dashboard')");
    this.contactsLink = this.container.locator(".nav-link:has-text('Contacts')");
    this.actionsLink = this.container.locator(".nav-link:has-text('Actions')");
  }

  /**
   * Clicks sidebar Dashboard link
   */
  public async clickDashboard(): Promise<void> {
    await BrowserHelper.click(this.page, this.dashboardLink, "Sidebar Dashboard Link");
  }

  /**
   * Clicks sidebar Contacts link
   */
  public async clickContacts(): Promise<void> {
    await BrowserHelper.click(this.page, this.contactsLink, "Sidebar Contacts Link");
  }

  /**
   * Clicks sidebar Actions link
   */
  public async clickActions(): Promise<void> {
    await BrowserHelper.click(this.page, this.actionsLink, "Sidebar Actions Link");
  }
}

/**
 * Component object representing page header blocks
 */
export class HeaderComponent {
  private page: Page;
  public readonly container: Locator;
  public readonly pageTitle: Locator;
  public readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator(".page-header");
    this.pageTitle = this.container.locator(".header-title");
    this.breadcrumb = this.container.locator(".breadcrumb-path");
  }

  /**
   * Gets text of the current page title
   */
  public async getTitle(): Promise<string> {
    return BrowserHelper.getText(this.page, this.pageTitle);
  }
}

/**
 * Component object representing Toast alerts/popups
 */
export class ToastComponent {
  private page: Page;
  public readonly container: Locator;
  public readonly messageText: Locator;
  public readonly closeBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator(".toast-message-popup");
    this.messageText = this.container.locator(".toast-message-body");
    this.closeBtn = this.container.locator(".toast-message-close");
  }

  /**
   * Gets message content of toast
   */
  public async getMessage(): Promise<string> {
    return BrowserHelper.getText(this.page, this.messageText);
  }

  /**
   * Determines if toast alert is currently visible
   */
  public async isVisible(): Promise<boolean> {
    return BrowserHelper.isVisible(this.page, this.container);
  }

  /**
   * Closes the active toast message
   */
  public async dismiss(): Promise<void> {
    await BrowserHelper.click(this.page, this.closeBtn, "Dismiss Toast close button");
  }
}

/**
 * Component object representing generic modal popup overlay containers
 */
export class ModalComponent {
  private page: Page;
  public readonly container: Locator;
  public readonly titleHeader: Locator;
  public readonly closeBtn: Locator;

  constructor(page: Page, modalSelector = ".modal-dialog-container") {
    this.page = page;
    this.container = page.locator(modalSelector);
    this.titleHeader = this.container.locator(".modal-dialog-header-title");
    this.closeBtn = this.container.locator(".modal-dialog-close-icon");
  }

  /**
   * Checks if modal dialog overlay is displayed
   */
  public async isVisible(): Promise<boolean> {
    return BrowserHelper.isVisible(this.page, this.container);
  }

  /**
   * Closes modal using close icon
   */
  public async close(): Promise<void> {
    await BrowserHelper.click(this.page, this.closeBtn, "Close Modal Dialog");
  }
}

/**
 * Component object representing critical confirmation decision popups
 */
export class ConfirmationDialogComponent {
  private page: Page;
  public readonly container: Locator;
  public readonly confirmBtn: Locator;
  public readonly cancelBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator(".confirmation-box-modal");
    this.confirmBtn = this.container.locator(".confirm-action-yes");
    this.cancelBtn = this.container.locator(".confirm-action-no");
  }

  /**
   * Agrees to confirmation dialog warning prompt (Yes/Confirm)
   */
  public async confirm(): Promise<void> {
    await BrowserHelper.click(this.page, this.confirmBtn, "Confirm dialog approval button");
  }

  /**
   * Dismisses confirmation dialog warning prompt (No/Cancel)
   */
  public async cancel(): Promise<void> {
    await BrowserHelper.click(this.page, this.cancelBtn, "Confirm dialog cancellation button");
  }
}
