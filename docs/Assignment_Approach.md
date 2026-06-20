# Platione QA Automation Starter Framework - Assignment Approach

This document outlines the systematic engineering approach taken to design, implement, and validate the **QA Automation Framework for Platione Sales Assist**. The goal was to build a reusable, production-ready automation foundation that scales for future QA engineers.

---

## 1. Compliance Matrix & Deliverables Coverage

The framework is structured to fully satisfy the three main deliverables of the assignment. Below is an overview of how each requirement was met:

### Deliverable 1: Reusable Test Data Framework
* **Data Factories (`data/factories/`)**:
  - `ContactFactory` generates valid contacts, customers, and duplicates, as well as invalid configurations (missing fields, bad email format) for negative testing.
  - `LeadFactory` handles leads, offering preset configurations like `Hot Lead` (high lead score, hot temperature) and `Cold Lead`.
  - `ActionFactory` and `InteractionFactory` support scheduling activities and history tracking, ensuring structured test state preparation.
* **Fluent Payload Builders (`api/builders/`)**:
  - `ContactBuilder` and `ActionBuilder` implement the Builder Pattern, allowing tests to override default factory data using method chaining (e.g., `new ContactBuilder().withEmail("custom@platione.com").build()`).
* **Multi-Channel Seeders (`data/seeders/`)**:
  - `ApiSeeder`: Seeds and cleans up records programmatically via REST clients. Tracks seeded entity IDs and performs cleanup in reverse topological order (Interactions -> Actions -> Contacts) to preserve relational integrity.
  - `DbSeeder`: Connects directly to the MySQL database via a `mysql2/promise` connection pool to execute migrations (`data/sql/schema.sql`) and seed data directly. Falls back gracefully to mock operations when offline.
  - `JsonSeeder`: Standardized loader for importing static JSON reference datasets (`data/json/contacts.json`).

### Deliverable 2: REST API Clients & Assertions
* **Modular Clients (`api/clients/`)**:
  - `ContactClient`, `ActionClient`, and `InteractionClient` encapsulate CRUD operations by wrapping the core HTTP request layer. They abstract endpoint URIs and return Playwright `APIResponse` payloads.
* **Encapsulated Assertions (`api/assertions/`)**:
  - `CommonAssertions` validates generic API traits, such as status code matches, JSON schema structures, and performance latency SLAs (e.g., response time `< 1000ms`).
  - `ContactAssertions` provides specialized logic for validation-error models, duplicate code responses, and schema properties.

### Deliverable 3: POM & Component Objects
* **Page Object Models (`pages/`)**:
  - Page-level interactions are encapsulated in `loginPage.ts`, `dashboardPage.ts`, `contactPage.ts`, `actionPage.ts`, and `interactionPage.ts`.
* **Modular Component Objects (`components/componentObjects.ts`)**:
  - Common UI elements (Navbar, Sidebar, Header, Toast, Modal, ConfirmationDialog) are grouped into isolated component objects nested inside parent Page Objects. This prevents code repetition across pages.
* **Unified Fixtures Context (`helper/fixtures.ts`)**:
  - Extends Playwright's test runner to inject all POM pages, REST clients, and API/DB seeders dynamically as custom fixtures. This handles authentication setups, db connections, and seed cleanups automatically before and after each test.

---

## 2. Technical Quality & Robustness

To ensure an enterprise-grade automation framework, the implementation incorporates several key technical design choices:

1. **Strict TypeScript Typing**: No `any` types are used for core entities. Interfaces defined in `data/interfaces.ts` govern all factory structures, builders, and payload definitions.
2. **Resilience & Offline Capabilities**:
   - `ApiHelper` intercepts network connection failures when the target environment is offline. It automatically serves predefined JSON responses via a mock fallback router, allowing developers to execute test suites locally without hitting external servers.
   - `DbSeeder` runs queries on a real database pool when database environment variables are configured. If the database is unreachable, it logs a warning and shifts to a mock pool executing mocked DML statements.
3. **Flakiness Reduction**:
   - UI tests use Playwright's auto-waiting locators and web-first assertions (e.g., `expect(locator).toBeVisible()`) rather than blocking timeouts, ensuring fast and stable tests on Chromium, Firefox, and WebKit.
