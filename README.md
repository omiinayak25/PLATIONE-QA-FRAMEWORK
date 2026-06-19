# Platione QA Automation Framework

A scalable QA Automation Framework built using **Playwright** and **TypeScript** for web UI and API automation. This project demonstrates a reusable, maintainable, and extensible automation framework that can serve as the foundation for testing the Platione Sales Assist application.

## Objective

The purpose of this project is to design an automation framework that supports:

- UI Automation
- API Automation
- Test Data Management
- Test Data Seeding
- Reusable Utilities
- Environment Configuration
- Scalable Project Architecture

The focus is on framework design and engineering best practices rather than implementing complete application automation.

---

# Technology Stack

- Playwright
- TypeScript
- Node.js
- Faker.js (Test Data Generation)
- dotenv (Environment Variables)
- REST API Testing
- Git & GitHub

---

# Project Structure

```
platione-qa-framework
│
├── api
│   ├── auth
│   ├── builders
│   ├── clients
│   └── assertions
│
├── components
│
├── config
│
├── data
│   ├── factories
│   ├── json
│   ├── seeders
│   └── sql
│
├── database
│
├── helpers
│
├── pages
│
├── reports
│
├── screenshots
│
├── tests
│   ├── api
│   └── ui
│
├── utils
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

# Framework Components

## UI Automation

The UI automation layer follows the **Page Object Model (POM)** to improve code reusability and maintainability.

Features include:

- Page Objects
- Component Objects
- Common Actions
- Navigation Helpers
- Assertions
- Authentication Handling

---

## API Automation

The API layer is designed using reusable API client classes.

Features include:

- Authentication Client
- Contact APIs
- Action APIs
- Interaction APIs
- Request Builders
- Response Validators
- API Assertions

---

## Test Data Management

Test data is generated using reusable factory classes.

Example entities:

- Contact
- Lead
- Customer
- Planned Action
- Completed Interaction
- Hot Lead
- Cold Lead
- Duplicate Contact

The framework supports:

- Dynamic data generation
- Reusable test data
- Custom test scenarios
- Edge case creation

---

## Test Data Seeding

The framework is designed to support multiple approaches for creating test data.

Supported approaches:

- API Seeders
- Database Seeders
- SQL Scripts
- JSON Seed Data

Actual implementations may use mock services where backend APIs are unavailable.

---

## Utility Layer

Reusable helper utilities include:

- Login Helper
- Environment Configuration
- Screenshot Utility
- Logger
- API Authentication Helper
- Database Helper
- Common Utilities

---

# Environment Configuration

Environment-specific configuration is managed using environment variables.

Example environments:

- QA
- Staging
- Production-like

Sensitive values such as URLs, credentials, and API tokens should be stored in `.env` files.

---

# Design Decisions

The framework is organized into independent layers to improve:

- Maintainability
- Reusability
- Readability
- Scalability

Each module has a single responsibility, making it easier for teams to extend the framework without affecting existing functionality.

---

# Scaling Strategy

This framework is designed to scale from a small automation suite to an enterprise-level project.

### 3 Tests

- Simple Page Objects
- Basic API Clients

### 50 Tests

- Shared Components
- Reusable Test Data
- Utilities
- Environment Management

### 500+ Tests

- Modular Architecture
- Parallel Execution
- CI/CD Integration
- Reusable Fixtures
- Team Collaboration
- Test Reporting

---

# CI/CD Ready

The framework is designed to integrate with CI/CD tools such as:

- GitHub Actions
- Jenkins
- Azure DevOps
- GitLab CI

Typical pipeline:

- Install Dependencies
- Execute UI Tests
- Execute API Tests
- Generate Reports
- Publish Artifacts

---

# How to Install

```bash
npm install
```

---

# Run UI Tests

```bash
npx playwright test tests/ui
```

---

# Run API Tests

```bash
npx playwright test tests/api
```

---

# Run All Tests

```bash
npx playwright test
```

---

# Generate Playwright Report

```bash
npx playwright show-report
```

---

# Future Enhancements

- Database Integration
- Docker Support
- Parallel Cross-Browser Execution
- Allure Reporting
- Retry Mechanism
- Slack Notifications
- Test Analytics Dashboard

---

# Author

**Omkar Nayakawadi**

QA Automation Engineer

Playwright | Selenium | TypeScript | Java | API Testing | Automation Framework Development
