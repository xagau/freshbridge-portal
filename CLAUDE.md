# FreshBridge Portal — Claude Code Guide

> **Sensitive config, API keys, credentials, and the GitHub PAT live in `private.md`** (gitignored — never committed).
> Read that file before working on anything that touches external services, authentication, or deployment, or before pushing to GitHub.

---

## What Is FreshBridge?

FreshBridge is Ontario's farm-direct B2B marketplace. It connects food buyers (chefs, restaurants, food service) directly with local Ontario farms, cutting out distributor markups. The platform handles ordering, logistics, payments, AI-assisted sourcing (FreshSelect™), and real-time inventory.

Website: https://freshbridge.ca

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19.2 (standalone components, no NgModules) |
| UI Library | PrimeNG 19 + Tailwind CSS 3.4 |
| Icons | PrimeIcons 7 |
| HTTP | Angular HttpClient + Fetch API |
| Auth | JWT (`@auth0/angular-jwt`), Google OAuth, Apple SSO |
| Maps | Leaflet 1.9 + leaflet-routing-machine |
| Charts | Chart.js 4.3 |
| PDF | jsPDF 4 + jspdf-autotable |
| Rich Text | Quill 2 |
| Image | ngx-image-cropper |
| QR Codes | angularx-qrcode |
| State | Angular Signals |
| Reactive | RxJS 7.8 |
| Language | TypeScript 5.6 (strict mode) |
| Linting | ESLint + Prettier |
| Testing | Karma + Jasmine |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── auth/                   # AuthService, AuthGuard, RoleGuard, user interface
│   ├── pages/                  # Route-level page components
│   │   ├── auth/               # Login, Register, Forgot Password, Verification, Callback
│   │   ├── dashboards/         # Role-based dashboards (Merchant, Buyer, Admin)
│   │   ├── order-list/         # Order management
│   │   ├── product/            # Product CRUD (list, create, overview, update)
│   │   ├── payment-invoice/    # Banking dashboard, transaction history
│   │   ├── merchant-managment/ # Admin: merchant accounts
│   │   ├── buyer-managment/    # Admin: buyer accounts
│   │   ├── account-access/     # Admin: user/role management
│   │   ├── analytics/          # Admin analytics dashboard
│   │   ├── audit-logs/         # Admin audit trail
│   │   ├── chat/               # FreshSelect AI assistant
│   │   ├── schedule-order/     # Repeat order scheduling
│   │   ├── profile/            # User profile & settings
│   │   └── components/         # Landing, Features, Pricing, Contact, FAQ pages
│   ├── service/                # 21 business logic services
│   ├── layout/                 # App shell (topbar, sidebar, menu, footer, layouts)
│   ├── components/             # Shared/reusable components (charts, modals, dialogs)
│   ├── model/                  # Data models and interfaces
│   ├── types/                  # TypeScript type definitions
│   ├── shared/pipes/           # Custom Angular pipes
│   ├── lib/utils.ts            # Utility functions
│   ├── app.routes.ts           # Main routing configuration
│   └── app.config.ts           # App bootstrap config (interceptors, providers)
├── environments/
│   ├── environment.ts          # Dev: localhost:8080
│   └── environment.prod.ts     # Prod: api.freshbridge.ca
├── assets/                     # Images, fonts, flags, styles
├── styles.scss                 # Global styles
└── main.ts                     # Bootstrap entry point
```

---

## User Roles & Access

| Role | Capabilities |
|---|---|
| `ADMIN` | Full system: user management, analytics, audit logs, all features |
| `MERCHANT` | Products (CRUD), orders (fulfillment side), dashboard, FreshSelect, payments |
| `BUYER` | Browse products, place/schedule orders, dashboard, FreshSelect, payments |
| `COURIER` | Order delivery tracking, FreshSelect |
| `USER` | Incomplete profile — redirected to profile completion |

Routes are protected by `AuthGuard` (authentication) and `RoleGuard` (role-based access). Each route declares which roles are permitted via route data.

---

## Key Routes

```
/                          Landing page
/features                  Features
/pricing                   Pricing
/contact                   Contact
/terms-and-conditions      Terms

/auth/login                Login
/auth/register             Register
/auth/verification         Email verification
/auth/forgot-password      Forgot password
/auth/new-password         Reset password
/auth/callback             Google OAuth callback
/profile-completion        Post-registration profile setup

/dashboard                 Role dashboard (MERCHANT, BUYER)
/freshselect               FreshSelect AI chat (all roles)
/profile                   User profile
/settings-security         Security settings (2FA, password)
/order-management          Orders
/product-management        Products (MERCHANT, BUYER)
/pi/transfer-history       Banking & payments
/schedule-order            Scheduled orders (ADMIN, BUYER)
/analytics                 Analytics (ADMIN)
/audit-logs                Audit logs (ADMIN)
/merchants-management      Merchant admin (ADMIN)
/buyers-management         Buyer admin (ADMIN)
/accounts-management       User/access admin (ADMIN)
```

---

## Services (src/app/service/)

| Service | Responsibility |
|---|---|
| `auth.service.ts` | Login, register, token management, SSO, 2FA |
| `orders.service.ts` | Order CRUD, role-based filtering |
| `product.service.ts` | Product CRUD, image uploads |
| `merchant.service.ts` | Merchant account management |
| `buyer.service.ts` | Buyer account management |
| `chat.service.ts` | FreshSelect AI conversations |
| `shipment.service.ts` | Shipment tracking and courier assignment |
| `transaction.service.ts` | Payment transactions |
| `dashboard-data.service.ts` | KPI and analytics data |
| `audit-log.service.ts` | System activity logging |
| `audit-log.interceptor.ts` | HTTP interceptor — logs all requests/responses |
| `notification.service.ts` | In-app notifications |
| `address.service.ts` | Address management |
| `account.service.ts` | Account/wallet operations |
| `bank-transfer.service.ts` | Bank transfer operations |
| `photo.service.ts` | Image upload handling |
| `country.service.ts` | Country/region reference data |
| `customer.service.ts` | Customer master data |
| `merchant-product.service.ts` | Product inventory |
| `member.service.ts` | Team members |
| `node.service.ts` | Complex business logic (largest service) |

---

## API Configuration

**Development** (`environment.ts`):
```
apiUrl: https://localhost:8080/api/v1/
wsUrl:  http://localhost/ws
```

**Production** (`environment.prod.ts`):
```
apiUrl: https://api.freshbridge.ca/api/v1/
wsUrl:  https://api.freshbridge.ca/ws
```

Key API namespaces:
- `/api/v1/auth/` — Authentication
- `/api/v1/orders/` — Orders
- `/api/v1/merchant-products/` — Products
- `/api/v1/assistant/` — FreshSelect AI
- `/api/v1/shipments/` — Shipments
- `/api/v1/transactions/` — Payments

WebSocket real-time updates are supported via the `wsUrl` endpoint.

---

## Authentication

- JWT tokens stored in `localStorage` under key `freshbridge_auth_token`
- User data stored under `freshbridge_user_data`
- Token validation via `JwtHelperService` (`@auth0/angular-jwt`)
- Social login: Google OAuth (callback at `/auth/callback`), Apple SSO
- 2FA: TOTP setup, QR code enrollment, verification codes

---

## Local Development

```bash
npm install
npm run dev        # Dev server at http://localhost:4200
npm run build      # Production build → dist/fresh-bridge-ng/
npm run format     # Prettier formatting
npm test           # Karma/Jasmine tests
```

The dev server binds to `0.0.0.0:4200` (all interfaces). The backend API is expected at `localhost:8080`.

---

## Code Conventions

- **Standalone components only** — no NgModules
- **Lazy loading** on all feature routes
- **Angular Signals** for reactive state (prefer over BehaviorSubjects for new code)
- **RxJS** for async HTTP and event streams
- **Strict TypeScript** — no implicit any, strict null checks
- **Prettier** for formatting — run `npm run format` before committing
- **PrimeNG** for UI components — extend existing component usage before rolling custom
- **Tailwind** for layout and spacing — use `app-dark` class for dark mode variants
- Route data carries role arrays; always guard new routes with the appropriate roles
- HTTP interceptor logs all requests — no need to add manual audit calls in services

---

## Testing

Test files follow `*.spec.ts` naming. Existing coverage:
- `login.spec.ts`
- `register.spec.ts`
- `forgotpassword.spec.ts`

Run a specific test file:
```bash
ng test --include="**/login.spec.ts"
```

---

## Deployment

Hosted on **Vercel**. Config in `vercel.json`. Production environment uses `environment.prod.ts` automatically via the Angular build system.

See `private.md` for Vercel project ID, team details, and any deploy tokens.

---

## Private / Sensitive Info

All credentials, API keys, secrets, and internal access details are documented in **`private.md`** in this directory.

`private.md` is listed in `.gitignore` and must **never** be committed or pushed to any repository.
