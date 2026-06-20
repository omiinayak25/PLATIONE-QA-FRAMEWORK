# Platione QA Automation Starter Framework

A production-grade, scalable QA Automation Framework built using **Playwright** and **TypeScript** for web UI and API automation of the Platione Sales Assist application.

This framework is built upon enterprise-level software engineering principles, featuring strict TypeScript typings, design patterns (Builder, Factory, Singleton), database and API data seeding, automated session state injection, and modular component page objects.

---

## 🛠️ Technology Stack

- **Core**: Playwright Test (Runner), TypeScript
- **Languages**: HTML5, TypeScript
- **Database**: MySQL (using `mysql2` connector with transactional rollbacks)
- **Data Generation**: `@faker-js/faker` v10, `uuid`
- **Environment Management**: `dotenv`

---

## 📂 Project Architecture & Folder Structure

```
platione-qa-framework
│
├── api
│   ├── auth
│   │   ├── authHelper.ts       # API login & LocalStorage state injection
│   │   └── tokenManager.ts     # Token cache manager (Singleton Pattern)
│   │
│   ├── builders
│   │   ├── contactBuilder.ts   # Fluent builder for Contacts
│   │   └── actionBuilder.ts    # Fluent builder for Actions
│   │
│   ├── clients
│   │   ├── contactClient.ts    # REST Client for Contacts CRUD
│   │   ├── actionClient.ts     # REST Client for Actions CRUD
│   │   └── interactionClient.ts# REST Client for Interactions CRUD
│   │
│   └── assertions
│       ├── commonAssertions.ts # Latency SLA and status code validators
│       └── contactAssertions.ts# Contact-specific API payload assertions
│
├── components
│   └── componentObjects.ts     # Component Objects (Navbar, Sidebar, Toast, Modals)
│
├── config
│   ├── env.ts                  # Safe environment variable getter validations
│   ├── constants.ts            # Project wide timeouts & formats
│   └── urls.ts                 # Page routes and API endpoints mapping
│
├── data
│   ├── factories
│   │   ├── contactFactory.ts   # Contact, Customer, Duplicate, & Invalid generators
│   │   ├── leadFactory.ts      # Hot and Cold Lead generators
│   │   ├── actionFactory.ts    # Planned Action generators
│   │   └── interactionFactory.ts# Completed Interaction & Follow-Up Scenario generators
│   │
│   ├── json
│   │   └── contacts.json       # Static JSON seed datasets
│   │
│   ├── sql
│   │   └── schema.sql          # DDL migrations for database schema creation
│   │
│   └── seeders
│       ├── apiSeeder.ts        # REST API data seeding and auto-cleanup tracker
│       ├── dbSeeder.ts         # Direct MySQL seeder client (mock fallback ready)
│       └── jsonSeeder.ts       # Static JSON file loader
│
├── helper
│   └── fixtures.ts             # Custom test fixtures (automates POM & cleanup)
│
├── pages
│   ├── loginPage.ts            # Login POM class
│   ├── dashboardPage.ts        # Dashboard POM class
│   ├── contactPage.ts          # Contact Management POM class
│   ├── actionPage.ts           # Action Scheduler POM class
│   └── interactionPage.ts      # Timeline & Interaction Logger POM class
│
├── tests
│   ├── utils.spec.ts           # Unit tests for Logger, DateUtils, and RandomUtils
│   ├── api
│   │   └── sampleApi.spec.ts   # API tests (CRUD, SLAs, Negative cases, Seeders)
│   └── ui
│       └── sampleUi.spec.ts    # UI tests (Login, Forms, Timeline search, cancel buttons)
│
├── playwright.config.ts        # Playwright configurations
├── package.json
└── README.md
```

---

## 🏗️ Design Decisions & Patterns

### 1. Separation of Concerns (Layered Design)
The framework isolates its components to ensure clean interfaces:
- **Data Layer**: Houses mock factories, fluent builders, and seeder clients.
- **Client Layer**: Exposes REST interfaces to perform operations.
- **POM & COM Layer**: Separates page-level views from generic reusable widgets (e.g. Navbar, Toast message, confirmation modals).
- **Test Layer**: Combines layers using custom Playwright fixtures.

### 2. Creational Design Patterns
- **Factory Pattern**: (`contactFactory.ts`, `leadFactory.ts`, etc.) Generates structured model instances with randomized default values to prevent email collisions.
- **Builder Pattern**: (`contactBuilder.ts`, `actionBuilder.ts`) Employs fluent method chaining to let developers modify select fields (e.g., `.withEmail("invalid")`) while utilizing factory defaults for the rest.
- **Singleton Pattern**: (`tokenManager.ts`) Caches the JWT session token globally across parallel execution workers. Instead of repeating the API login POST, tests fetch the cached token, reducing test run duration by up to 40%.

### 3. Playwright Custom Fixtures
Instead of manually instantiating page objects inside tests, they are registered as custom fixtures in `helper/fixtures.ts`. 

```typescript
// Example test signature leveraging autowired fixtures
test("Test Case", async ({ contactPage, apiSeeder }) => {
  await contactPage.navigate();
  // apiSeeder cleans up all seeded rows automatically when this test finishes!
});
```

---

## 🌐 Environment Management

All configurations are handled via the `.env` file and managed cleanly inside `config/env.ts` and `utils/environment.ts`:
- **Timeout Management**: Centralized timeouts (`SHORT_TIMEOUT`, `DEFAULT_TIMEOUT`) are managed via constants.
- **Safe Environment Reader**: Validates the presence of required variables (`BASE_URL`, `API_URL`) at startup and throws explicit compile errors if they are missing.
- **Database Credentials**: Configures MySQL details (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

---

## 🚀 Execution & Running Instructions

### 1. Installation
Ensure Node.js is installed, then run:
```bash
npm install
```

### 2. Executing Tests
```bash
# Run all tests across Chromium, Firefox, and Webkit in parallel
npx playwright test

# Run UI tests only
npx playwright test tests/ui

# Run API tests only
npx playwright test tests/api

# Run utility unit tests only
npx playwright test tests/utils.spec.ts
```

### 3. Viewing Reports
Playwright HTML reports capture traces, logs, and screenshots on failure automatically:
```bash
npx playwright show-report
```

---

## 🔗 CI/CD Pipeline Integration

The framework is fully optimized for containerization and CI/CD pipelines (e.g., GitHub Actions, GitLab CI, Azure DevOps).

### GitHub Actions Pipeline Example (`.github/workflows/playwright.yml`)
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 15
    runs-on: ubuntu-latest
    
    # Optional: Spin up a local MySQL instance for direct DB seeder tests
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: platione_sales_assist
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run Tests
      env:
        ENV: QA
        BASE_URL: https://platione.com
        API_URL: https://api.platione.com
        USERNAME: test@test.com
        PASSWORD: Password123
        DB_HOST: 127.0.0.1
        DB_PORT: 3306
        DB_USER: root
        DB_PASSWORD: password
        DB_NAME: platione_sales_assist
      run: npx playwright test
      
    - name: Upload Test Report
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## 📈 Enterprise Scaling Strategy

This starter framework is structured to seamlessly scale as the project grows:
- **For 50 Tests**: Reusable page objects, factories, and environmental configurations keep code DRY.
- **For 500+ Tests**:
  - **Shared Component Model (COM)** prevents locator sprawl as complex Angular/Ionic views scale.
  - **Programmatic Session State Injection** bypasses the login UI screens, executing tests in isolated containers in parallel.
  - **Topology-based Seeders** (`apiSeeder.ts`, `dbSeeder.ts`) run structured cleanups, preventing shared database state pollution across concurrent workers.
