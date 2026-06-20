# Framework Architecture - Platione QA Automation Framework

This document outlines the layered architecture of the Platione Sales Assist QA Automation Framework. The system is divided into clean boundary layers to maximize reusability, isolation, and type safety.

---

## 1. Directory Structure Map

```
platione-qa-framework/
├── config/               # Global configuration options (Environment, constants, URL maps)
├── utils/                # General low-level system utilities (Logging, fake data generation, screenshots)
├── data/                 # Test Data management layer
│   ├── factories/        # Creational factories (Contact, Lead, Action, Interaction templates)
│   ├── seeders/          # Database, API, and JSON seeders
│   └── sql/              # Static schema and migration definitions
├── api/                  # REST API encapsulation layer
│   ├── auth/             # Session caches (TokenManager) and authentication logic
│   ├── builders/         # Method-chained HTTP request payload builders
│   ├── clients/          # REST clients routing actions to HTTP endpoints
│   └── assertions/       # Dedicated validations, error checks, and SLA metrics
├── pages/                # UI Page Object Models
├── components/           # UI Component Object Models (Navbar, Toast, Dialog modals)
├── helper/               # Test runner extensions (Custom Playwright fixtures)
└── tests/                # Automated UI and API test specifications
```

---

## 2. Layers & Responsibility Boundaries

To maintain a maintainable codebase, components are layered from lowest dependency to highest:

```
┌────────────────────────────────────────────────────────┐
│                   Test Specifications                  │
│               (tests/*.spec.ts)                        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼ (Resolves dependencies via custom fixtures)
┌────────────────────────────────────────────────────────┐
│                    Custom Fixtures                     │
│               (helper/fixtures.ts)                     │
└─────┬────────────────────────────────────────────┬─────┘
      │                                            │
      ▼ (For UI-based scenarios)                   ▼ (For API-based scenarios)
┌───────────────────────────┐                ┌───────────────────────────┐
│     Page & Component      │                │  API Clients & Assertions │
│          Objects          │                │    (api/clients/*,       │
│     (pages/*, comp/*)     │                │     api/assertions/*)     │
└─────────────┬─────────────┘                └─────────────┬─────────────┘
              │                                            │
              ├──────────────────────┬─────────────────────┘
              │                      │
              ▼                      ▼
┌───────────────────────────┐  ┌───────────────────────────┐
│    Utilities & Helpers    │  │    Creational & Seeders   │
│  (utils/browserHelper.ts, │  │   (data/factories/*,      │
│   utils/apiHelper.ts)     │  │    data/seeders/*)        │
└───────────────────────────┘  └───────────────────────────┘
```

### A. Test Specifications Layer (`tests/`)
- Declares the test cases, flows, and assertions.
- **Rule**: Specs should contain *only* business-logic scenarios. No direct HTTP calls, database client invocations, or DOM selector strings are permitted inside test specifications.

### B. Custom Fixtures Layer (`helper/fixtures.ts`)
- Configures the execution runtime by injecting Page Objects, clients, and seeders into tests.
- Handles automatic startup and tear-down logic (e.g., executing seed rollbacks after a test finishes, regardless of failure status).

### C. Page Object & Component Object Layers (`pages/` & `components/`)
- Encapsulates UI structures.
- Selectors are declared inside page objects to isolate tests from frontend code refactors.
- Repeatable layout parts (like alert boxes or sidebar links) are extracted into standard Component Objects.

### D. API Client & Assertion Layers (`api/`)
- Interacts with HTTP REST services.
- Payload Builders allow fluent parameter definitions.
- Custom Assertions keep verification logic reusable and consistent across the framework.

### E. Seeders & Factories Layer (`data/`)
- Generates data dynamically (Factories) and loads static JSON lists.
- Seeders create records directly on MySQL databases (`DbSeeder`) or through client endpoints (`ApiSeeder`), tracking references to purge them during teardown.

---

## 3. End-to-End Execution Flows

### UI Test Flow:
1. Playwright runner instantiates a test case using custom fixtures.
2. The fixture hooks check the `TokenManager` Singleton for a cached bearer token.
3. If not cached, the helper logs in programmatically via the API and caches the JWT token.
4. The helper injects the JWT token directly into the browser's LocalStorage.
5. The page navigates directly to the target UI screen (e.g., Contacts Dashboard), skipping the login screen.
6. The test script performs actions through POM methods, validating results using web-first auto-wait assertions.
7. Post-test cleanup hooks trigger in the background to purge data created during the test context.

### API Test Flow:
1. The test specification initiates.
2. The client routes requests through the `ApiHelper` wrapper.
3. If the network is online, the request hits the REST endpoint with bearer authorization headers.
4. If the server is offline or unreachable, the `ApiHelper` captures the exception and routes the call to a mock fallback registry, returning expected JSON structures.
5. The test validates response structures and execution SLA latency metrics.
