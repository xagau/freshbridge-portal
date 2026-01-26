# FreshBridge Portal (Angular)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Requirements

node --version
v22.16.0
npm --versions
11.4.1

## Development server

Install dependencies:

```bash
npm install
```

Start a local development server:

```bash
npm run dev
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

To start the production-configured dev server:

```bash
npm start
```

## Overview

FreshBridge Portal is a role-based B2B commerce portal built with Angular. It provides authenticated access to dashboards, orders, products, payments, and administrative tools for merchants, buyers, couriers, and admins.

## Key features (frontend)

- Authentication and authorization
  - Login/register flows, forgot/new password, and profile completion
  - Role-based guards and session handling
- Dashboards and analytics
  - KPI widgets and buyer/merchant analytics
- Order management
  - Order list, detail views, shipment assignment, and scheduling
- Product management
  - Product list, create, update, and overview
- Payments and invoices
  - Credit score, transaction history, and transfers
- Account and user management (admin)
  - Merchant/buyer management and user access controls
- Settings and profile
  - Address and profile updates
- FreshSelect assistant
  - In-app chat interface for assisted search

## Project structure (frontend)

- Auth pages: `src/app/pages/auth/`
  - Login: `src/app/pages/auth/login/`
  - Register: `src/app/pages/auth/register/`
  - Forgot password: `src/app/pages/auth/forgotpassword.ts`
  - New password: `src/app/pages/auth/newpassword.ts`
  - Profile completion: `src/app/pages/auth/profile-completion/`
- Auth service and guards: `src/app/auth/`
- Dashboards: `src/app/pages/dashboards/`
- Orders: `src/app/pages/order-list/`, `src/app/pages/schedule-order/`
- Products: `src/app/pages/product/`
- Payments: `src/app/pages/payment-invoice/`
- Analytics: `src/app/pages/analytics/`
- Account access: `src/app/pages/account-access/`
- Settings: `src/app/pages/settings/`
- Environment config: `src/environments/`

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

Auth-related unit tests:

```bash
ng test --include="**/login.spec.ts"
ng test --include="**/register.spec.ts"
ng test --include="**/forgotpassword.spec.ts"
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
