# Test Data Management - Platione QA Automation Framework

This document outlines how the framework handles mock data generation, data customization, programmatic seeding, and database schema migrations.

---

## 1. Dynamic Data Factories

The `data/factories/` directory contains classes that construct baseline mock payloads. This keeps test files clean and isolates them from schema updates:

- **`ContactFactory`**:
  - `createContact()`: Generates a baseline active contact (random first name, last name, phone, company, email).
  - `createCustomer()`: Generates a contact pre-configured with the status `"Customer"`.
  - `createDuplicateContact(baseContact)`: Replicates existing properties of a contact to verify duplicate email detection logic.
  - `createInvalidContact(errorType)`: Generates payloads lacking critical elements (e.g., empty emails, invalid email syntax, missing names) for validation tests.
- **`LeadFactory`**:
  - `createLead()`: Creates standard lead records with random score metrics.
  - `createHotLead()` / `createColdLead()`: Creates leads with predefined scores and temperature attributes.
- **`ActionFactory` & `InteractionFactory`**:
  - Prepares task events and historical client log data.

---

## 2. Payload Customization (Builders)

For precise edge-case tests, rather than declaring raw JSON blocks, the framework utilizes fluent Builders (`ContactBuilder`, `ActionBuilder`):
```typescript
const customContactPayload = new ContactBuilder()
  .withEmail("edge-case@platione.com")
  .withStatus("Customer")
  .build();
```
- **Why this is preferred**: The Builder instantiates a default valid contact internally. Calling `.withEmail()` overrides *only* the email. The resulting object is structurally valid, avoiding errors caused by missing sibling properties (e.g., missing phone or company) in the API endpoint.

---

## 3. Seeders & Migrations Layer

The `data/seeders/` layer provides three distinct strategies to provision environment state:

### A. API-Driven Seeding (`ApiSeeder`)
- Uses endpoint clients to seed records.
- Records created during a test execution are tracked in private arrays (`seededContactIds`, etc.).
- When the test completes, the custom fixture automatically calls `apiSeeder.cleanup()`, deleting the records in reverse order of relational dependencies.

### B. Direct Database Seeding & Schema Migrations (`DbSeeder`)
- Connects directly to a MySQL database using `mysql2/promise`.
- **`executeSqlScript(filePath)`**: Can run standard SQL files, such as `data/sql/schema.sql`, to initialize the database tables and columns before execution.
- **`seedContact` / `seedAction` / `seedInteraction`**: Inserts data directly into MySQL tables using SQL statements.
- **Mock Mode**: If database credentials are empty or the database host is unreachable, the system automatically falls back to an offline Mock Mode that executes simulated mock logs, allowing the entire suite to run offline.

### C. Static JSON Data Seeding (`JsonSeeder`)
- **`loadContacts()`**: Imports reference list data from standard JSON files (`data/json/contacts.json`).
- Useful for loading stable static configuration metrics or reference catalogs that do not change between test executions.
