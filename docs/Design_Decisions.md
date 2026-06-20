# Design Decisions - Platione QA Automation Framework

This document records the architectural and creational patterns selected to make the framework modular, reusable, type-safe, and resilient.

---

## 1. Creational Patterns

To decouple raw test scripts from the instantiation details of payloads and test states, the framework implements the following creational patterns:

### A. Factory Pattern (`data/factories/`)
Instead of hardcoding objects or configurations directly in spec files, specialized factory classes manage data generation:
- **`ContactFactory`**: Centralizes instantiation of valid, duplicate, customer, and invalid profiles.
- **`LeadFactory`**: Implements pre-configured lead personas (`Hot Lead`, `Cold Lead`) using logical thresholds (e.g., Lead Score `80-100` and Temperature `Hot`).
- **Benefits**:
  - Centralizes schema changes. If the schema of a "Contact" changes (e.g., adding an address field), it only needs to be updated in the `ContactFactory` rather than in hundreds of spec files.
  - Improves readability of test suites by replacing long JSON objects with readable method calls (e.g., `ContactFactory.createContact()`).

### B. Builder Pattern (`api/builders/`)
For cases where a test case needs to verify precise parameters (e.g., negative validations or boundary checks), the Builder Pattern provides fluent method chaining:
- **`ContactBuilder`** & **`ActionBuilder`**:
  ```typescript
  const customContact = new ContactBuilder()
    .withFirstName("Jane")
    .withEmail("invalid-email")
    .build();
  ```
- **Benefits**:
  - Replaces the telescoping constructor problem.
  - Ensures that even when a single attribute is custom-tailored for a test scenario, the rest of the payload remains structurally complete and valid.

### C. Singleton Pattern (`api/auth/tokenManager.ts`)
Programmatic authentication creates significant API traffic when hundreds of tests run in parallel workers. The `TokenManager` class caches credentials to avoid redundant API request operations:
- A private constructor prevents direct instantiation.
- The static `TokenManager.getInstance()` method manages a single static wrapper that stores the JWT bearer token.
- **Benefits**:
  - The token is fetched exactly once per worker process and reused across subsequent tests.
  - Offers a public `refreshToken()` mechanism to clear cache and re-acquire access if a token expires during execution.

---

## 2. Structural & Behavioral Patterns

The organization of components, pages, and execution flows utilizes structural patterns to separate concerns:

### A. Page Object Model (POM) (`pages/`)
Page objects encapsulate user interactions and target elements for distinct layouts:
- e.g., `LoginPage`, `DashboardPage`, `ContactPage`.
- **Decision**: Test specifications (`*.spec.ts`) must never contain raw element selectors (like CSS or XPath strings) or direct interaction methods. They should invoke human-readable actions on page objects (e.g., `await contactPage.createNewContact(contactData)`).

### B. Component Object Model (COM) (`components/componentObjects.ts`)
To prevent Page Objects from growing too large, shared widgets are abstracted into standalone component classes:
- Represents global or repeating blocks such as `Navbar`, `Sidebar`, `ToastAlert`, `ModalOverlay`, and `ConfirmationBox`.
- Parent Page Objects host these components as properties:
  ```typescript
  // Inside ContactPage
  public navbar = new Navbar(this.page);
  public sidebar = new Sidebar(this.page);
  ```
- **Benefits**:
  - Drastically reduces code repetition. A change in the layout of the navigation sidebar is updated in one location (`componentObjects.ts`) and is immediately propagated across all page objects.

### C. Dependency Injection via Custom Playwright Fixtures (`helper/fixtures.ts`)
To manage setup complexity, all page objects, REST clients, and seeders are wired together and injected into test environments:
- Uses Playwright's `test.extend()` mechanism to define an extended test context.
- Instantiates classes on-demand per test block and automatically invokes teardown cleanup operations (e.g., `apiSeeder.cleanup()` or closing DB connections).
- **Benefits**:
  - Clean test suites that do not need `beforeEach` or `afterEach` boilerplate code.
  - Promotes absolute isolation of browser instances and state between test threads.
