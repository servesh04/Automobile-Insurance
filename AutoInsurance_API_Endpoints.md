# AutoInsurance.Microservices — API Endpoint Reference

This document lists every endpoint across the 5 services, ordered to match the demo flow: **Register → Customer → Vehicle → Policy → Claim → Gateway**.

**Base ports:** AuthService `:7001` · CustomerService `:7002` · VehicleService `:7003` · PolicyService `:7004` · ClaimService `:7005` · ApiGateway `:9000`

**Roles:** `Admin` (full control, only one who can delete) · `Agent` (day-to-day staff operations) · `Customer` (self-service, read-only, own records only)

---

## 1. AuthService (`:7001`) — Login & Registration

No JWT validation here — this service only *issues* tokens.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/Auth/login` | None | Verifies username/password (BCrypt), returns a signed JWT with UserId, Username, FullName, and Role claims. |
| POST | `/api/Auth/register` | None | Self-service registration. Creates a `User` row with the `Customer` role and returns a token immediately — satisfies the PDF's "register without an officer" requirement. |

**Seeded accounts:** `admin`/`admin123` (Admin) · `agent`/`agent123` (Agent) · `customer`/`cust123` (Customer)

---

## 2. CustomerService (`:7002`) — Customer Profiles

Every endpoint below (except none — all require a token) is guarded by the custom `JwtMiddleware` + `[Authorize]`.

| Method | Endpoint | Roles | Notes |
|---|---|---|---|
| GET | `/api/Customers` | Admin, Agent | Full list — Customer role cannot call this at all. |
| GET | `/api/Customers/{id}` | Admin, Agent, Customer | **Ownership-checked**: a Customer token only succeeds if `Customer.UserId` matches the caller's token `UserId`; otherwise `404`. Admin/Agent bypass this check. |
| POST | `/api/Customers` | Any authenticated user | `UserId` is extracted from the token claim (`ClaimTypes.NameIdentifier`), never trusted from the request body — this is what creates the ownership link. |
| PUT | `/api/Customers/{id}` | Admin, Agent | Customer role cannot update any profile, including their own. |
| DELETE | `/api/Customers/{id}` | Admin only | |

**Validation on Create/Update:** `FullName` (letters only, 2–100 chars) · `Email` (valid format) · `Phone` (exactly 10 digits) · `DateOfBirth` (must be 18+, custom `MinimumAgeAttribute`) · `LicenseNumber` (5–20 chars) · `ZipCode` (exactly 6 digits)

---

## 3. VehicleService (`:7003`) — Vehicle Registry

| Method | Endpoint | Roles | Notes |
|---|---|---|---|
| GET | `/api/Vehicles` | Admin, Agent | |
| GET | `/api/Vehicles/{id}` | **Admin, Agent only** | Customer has no direct access — they see vehicle info secondhand via `PolicyResponseDto.VehicleDescription`. |
| POST | `/api/Vehicles` | Admin, Agent | |
| PUT | `/api/Vehicles/{id}` | Admin, Agent | |
| DELETE | `/api/Vehicles/{id}` | Admin only | |

**Validation on Create/Update:** `Make`/`Model` (2–50 chars) · `Year` (1980–2027) · `VehicleIdentificationNumber` (exactly 17 chars, no I/O/Q per real VIN standard) · `Color` (letters only) · `FuelType` (must be one of: Petrol, Diesel, Electric, Hybrid, CNG)

---

## 4. PolicyService (`:7004`) — Issued Policies

The first service that calls **other services over HTTP**, forwarding the caller's Bearer token via `IHttpContextAccessor`.

| Method | Endpoint | Roles | Notes |
|---|---|---|---|
| GET | `/api/Policies` | Admin, Agent | |
| GET | `/api/Policies/{id}` | Admin, Agent, Customer | **Ownership-checked** via `OwnerUserId`, resolved live by calling CustomerService for the policy's `CustomerId` → `UserId`. `-1` fallback if the lookup fails (never matches a real caller). |
| POST | `/api/Policies` | Admin, Agent | Calls CustomerService + VehicleService to validate `CustomerId`/`VehicleId` exist before saving. Returns `400` if either is invalid. Auto-generates `PolicyNumber` (`POL-yyyyMMddHHmmss-####`), sets `PolicyStatus = "Active"`. |
| PUT | `/api/Policies/{id}` | Admin, Agent | |
| DELETE | `/api/Policies/{id}` | Admin only | |

**Validation on Create/Update:** `CustomerId`/`VehicleId` (positive) · `CoverageType` (must be ThirdParty, Comprehensive, or Collision) · `PremiumAmount` (> 0) · `EndDate` must be after `StartDate` (cross-field check via `IValidatableObject`)

---

## 5. ClaimService (`:7005`) — Claims Processing

Calls PolicyService over HTTP; ownership is resolved **two hops deep** (Claim → Policy → Customer).

| Method | Endpoint | Roles | Notes |
|---|---|---|---|
| GET | `/api/Claims` | Admin, Agent | |
| GET | `/api/Claims/{id}` | Admin, Agent, Customer | **Ownership-checked** via the claim's policy's `OwnerUserId`. |
| POST | `/api/Claims` | Admin, Agent, Customer | Customers can file their own claims. Calls PolicyService to confirm the policy exists **and** is `Active` — rejects with `400` otherwise. Auto-generates `ClaimNumber` (`CLM-yyyyMMddHHmmss-####`), sets `ClaimStatus = "Pending"`. |
| PUT | `/api/Claims/{id}/status` | Admin, Agent | Officer approval/rejection. |
| DELETE | `/api/Claims/{id}` | Admin only | |

**Validation on Create:** `PolicyId` (positive) · `IncidentDescription` (10–500 chars) · `ClaimAmount` (> 0) · `IncidentDate` cannot be in the future.
**Validation on status update:** `ClaimStatus` (must be Pending, Approved, or Rejected) · `ResolvedAt` is required when status is Approved/Rejected, and cannot be in the future.

---

## 6. ApiGateway (`:9000`) — Single Entry Point

Pure routing via Ocelot — performs **no authentication itself**; every downstream service still runs its own `JwtMiddleware` + `[Authorize]` exactly as if called directly.

| Gateway Route | Forwards To |
|---|---|
| `POST /gateway/auth/login` | AuthService `:7001` |
| `POST /gateway/auth/register` | AuthService `:7001` |
| `GET, POST /gateway/customers` | CustomerService `:7002` |
| `GET, PUT, DELETE /gateway/customers/{id}` | CustomerService `:7002` |
| `GET, POST /gateway/vehicles` | VehicleService `:7003` |
| `GET, PUT, DELETE /gateway/vehicles/{id}` | VehicleService `:7003` |
| `GET, POST /gateway/policies` | PolicyService `:7004` |
| `GET, PUT, DELETE /gateway/policies/{id}` | PolicyService `:7004` |
| `GET, POST /gateway/claims` | ClaimService `:7005` |
| `GET, DELETE /gateway/claims/{id}` | ClaimService `:7005` |
| `PUT /gateway/claims/{id}/status` | ClaimService `:7005` |

---

## Error Handling (applies across all 5 services)

| Status | Trigger | Response shape |
|---|---|---|
| 400 | DTO validation failure (model binding) | `{ "success": false, "message": "Validation failed.", "errors": [...] }` |
| 400 | Invalid foreign reference (e.g. bad `CustomerId`, inactive policy) | `{ "message": "..." }` from the controller |
| 401 | Missing token | `{ "success": false, "message": "You are not authenticated. Please provide a valid token." }` (via `UseStatusCodePages`) |
| 401 | Invalid/expired token | `{ "message": "Invalid or expired token" }` (via custom `JwtMiddleware`) |
| 403 | Valid token, wrong role, or failed ownership check | `{ "success": false, "message": "You do not have permission to perform this action." }` |
| 404 | Resource not found, or ownership mismatch (existence hidden) | `{ "success": false, "message": "The requested resource was not found." }` |
| 500 | Any unhandled exception | `{ "success": false, "message": "An unexpected error occurred. Please try again later." }` — full exception logged server-side via `ILogger`, never shown to the client |

---

## Demo Flow Order

1. **Register** (`POST /api/Auth/register`) → get token
2. **Create own Customer profile** (`POST /api/Customers`) → linked via token's `UserId`
3. **Ownership check** — own record succeeds, others' `404`; PUT/DELETE as Customer → `403`
4. **Switch to Agent** → full Customer CRUD, list view
5. **VehicleService** — create vehicle, trigger VIN validation error
6. **PolicyService** — create with valid IDs (cross-service call), invalid ID → `400`, bad date range → `400`, Customer ownership check on `GetById`
7. **ClaimService** — file claim on Active policy, reject on inactive policy → `400`, future incident date → `400`, two-hop ownership check, Agent approves with `PUT /status`
8. **ApiGateway** — same calls routed through `:9000`
9. **Error handling** — garbage token (`401`), wrong role (`403`), bad route (`404`)
10. **NUnit tests** — Test Explorer, run all (53 tests across 5 services)
