# Framework Scalability - Platione QA Automation Framework

This document explains the technical practices used to ensure the framework scales efficiently as the test suite grows.

---

## 1. Parallel Execution & Worker Isolation

Playwright executes tests concurrently by distributing specs across multiple isolated worker processes:
- **No Shared State**: Each worker process spawns its own browser instance. Browser contexts are fully isolated, meaning cookies, localStorage, and cache are never shared between test files.
- **Worker-Safe Caching**: The Singleton `TokenManager` stores the authentication token per worker. This ensures that even with hundreds of test cases running on multiple CPU threads, authentication happens only once per worker process, minimizing overhead.
- **Resource Management**: System timeouts and timeouts in `playwright.config.ts` are calibrated to adjust automatically, preventing thread locking during high-density concurrent executions.

---

## 2. Programmatic Bypassing of UI Logins

Using UI forms to log in before every test case causes significant performance bottlenecks. To maximize execution speed, the framework implements programmatic login bypassing:

1. **API Authentication (`authHelper.ts`)**:
   - The framework makes a direct HTTP POST request to the login endpoint to fetch the authorization token.
2. **LocalStorage State Injection**:
   - During the UI fixture setup, the retrieved token is directly injected into the page context's LocalStorage:
     ```typescript
     await page.context().addInitScript((token) => {
       window.localStorage.setItem("authToken", token);
     }, sessionToken);
     ```
3. **Direct Navigation**:
   - The browser navigates directly to the authenticated page.
   - **Result**: Cuts test setup time from 3-5 seconds (UI login form interaction and submit) down to less than 300 milliseconds.

---

## 3. Database & Relational Isolation

When tests run concurrently, they can write to the same database tables. To prevent primary key conflicts and database deadlocks, the following isolation strategies are implemented:

- **Non-overlapping Identifiers**:
  - Every seeded entity uses a unique identifier generated via `RandomUtils.getUUID()` or timestamp suffixes.
  - Test descriptions and fields are randomized (e.g., dynamic emails such as `john.doe_178493@platione.com`) to prevent duplicate constraint violations.
- **Reverse-Order Cascading Teardown**:
  - Relational database constraints require that dependent child rows are removed before parent tables.
  - The `ApiSeeder` and `DbSeeder` track seeded IDs in array lists and run cleanups in reverse topological order during teardown:
    1. **Completed Interactions** (Child records dependent on Contacts)
    2. **Planned Actions** (Child records dependent on Contacts)
    3. **Contacts** (Parent entity)
  - This ensures that database foreign key constraints never block teardown operations.
