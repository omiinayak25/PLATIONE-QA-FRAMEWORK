# REST API Testing Framework Guide

This document outlines the architecture, request flow, authentication, and assertions of the REST API automation layer within the Platione Sales Assist framework.

---

## 1. Core API Components

The API layer is structured to isolate endpoint routes, credential retrieval, and validations from the actual test specifications.

```
api/
├── auth/
│   ├── authHelper.ts       # Direct API authentication & LocalStorage state injection
│   └── tokenManager.ts     # Token cache container (Singleton Pattern)
│
├── builders/
│   ├── contactBuilder.ts   # Fluent builder for Contact payloads
│   └── actionBuilder.ts    # Fluent builder for Action payloads
│
├── clients/
│   ├── contactClient.ts    # Contact CRUD requests router
│   ├── actionClient.ts     # Planned actions router
│   └── interactionClient.ts# Completed client history router
│
└── assertions/
    ├── commonAssertions.ts # Latency SLA and status code validations
    └── contactAssertions.ts# Specialized Contact schema assertions
```

---

## 2. Authentication & Token Management

To maximize execution speed and protect backend databases, the framework avoids logging in via the UI before each test. Instead, it utilizes programmatic API tokens:

1. **Singleton Caching (`tokenManager.ts`)**:
   - Manages a static class instance that caches the JWT session token globally across parallel execution workers.
   - Restricts login queries to exactly once per worker process unless the token is explicitly cleared or refreshed.
2. **LocalStorage State Injection (`authHelper.ts`)**:
   - Injects the session token directly into the browser's LocalStorage during UI setup. This allows the page objects to bypass the login page screen, saving seconds on every test thread.

---

## 3. Fluent Request Builders

Payload customization utilizes the **Builder Pattern** (`contactBuilder.ts`, `actionBuilder.ts`). Instead of declaring complex mock objects in the test specs, developers use method chaining to override default variables:

```typescript
// Create a contact with custom duplicate email properties
const duplicateContact = new ContactBuilder()
  .withEmail("duplicate@platione.com")
  .build();
```

- **Benefit**: Ensures that even when a single property is customized for edge case testing, all other fields remain structurally complete and valid.

---

## 4. API Request Execution Flow

Every API call flows sequentially through the following modules:

```
[Test Spec File]
       │
       ▼ (Uses custom client fixture)
[ContactClient / ActionClient]
       │
       ▼ (Passes request context and caches session token)
[ApiHelper (utils/apiHelper.ts)]
       │
       ▼ (Injects Bearer token headers)
[Playwright APIRequestContext] ──(Offline connection failure)──► [Mock Fallback Router]
       │                                                                  │
       ▼ (Successful Request)                                             ▼
[REST Endpoint Server] ───────────────────────────────────────────► [APIResponse Shape]
```

- **Mock Fallback Resilience**: If the target server is unreachable (defaulting to the mock configuration), the `ApiHelper` intercepts connection errors and returns pre-populated `MockApiResponse` JSON shapes so tests can run completely offline.

---

## 5. Assertions and Latency SLAs

API validations are centralized in the `assertions/` layer rather than written directly in test specifications:
- **CommonAssertions (`commonAssertions.ts`)**: Exposes status code checks, body subset inclusions, and response timing latency benchmarks.
- **ContactAssertions (`contactAssertions.ts`)**: Exposes email-specific formatting checks, ID property checks, and duplicate conflict error validations.
- **SLA Benchmarking**: Asserts that HTTP latency values are within target thresholds (e.g., `< 1000ms`) to monitor backend responsiveness.
