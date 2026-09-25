# 💳 LoanPoint

**LoanPoint** is a full-stack loan-management platform for customers and loan officers. Customers can register, sign in, explore loan products, estimate interest, submit loan applications with PAN-card documentation, and track decisions. Loan officers can review applications, inspect credit-score activity and supporting documents, approve or reject applications, and manage the loan-product catalogue.

Built with **React**, **Spring Boot microservices**, **Oracle**, **Kafka**, **Eureka**, and **JWT authentication**, the platform provides a role-based lending workflow behind a single API gateway.

---

## ✨ Features

- Customer registration and role-based JWT authentication
- Customer and loan-officer portals with protected client-side routes
- Loan-product catalog, search, and officer-managed CRUD operations
- Loan application creation, interest-rate calculation, status tracking, and PAN-card image upload
- Officer application review, approval/rejection workflow, and document retrieval
- Kafka event flow that seeds a customer credit score after registration
- Eureka service discovery and gateway-based routing

---

## 🏗️ Architecture

```text
React + Vite client (Frontend, port 5173)
                |
                v
     API Gateway (port 9000) ----> Eureka Registry (port 8761)
                |                       ^
     +----------+----------+------------+----------+
     |          |          |            |          |
  Auth       Customer   Credit Score  Loan Type  Loan Application
  :8000       :8001        :8002        :8081        :8083
                              ^                         ^
                              |                         |
                        Kafka `customer.registered`  Loan Officer :9001
                                                  (service-to-service calls)
```

All backend services register with the Eureka service registry. The gateway resolves services by their registered names and forwards the public API paths listed below.

---

## 🛠️ Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, React Router, Vite, ESLint |
| Backend | Java 17, Spring Boot, Spring MVC, Spring Cloud, Spring Security |
| Service platform | Netflix Eureka, Spring Cloud Gateway (Server MVC) |
| Data | Spring Data JPA/JDBC, Oracle Database |
| Messaging | Apache Kafka, Spring for Apache Kafka |
| Security | JWT (`jjwt`) with customer and loan-officer roles |
| Build & test | Maven Wrapper, JUnit/Spring Boot Test; npm |

---

## 📁 Project Structure

```text
.
├── Frontend/                         # React/Vite application
├── Backend/
│   ├── service-registry/             # Eureka server
│   ├── api-gateway/                  # Gateway and JWT filter
│   ├── auth-service/                 # Customer/officer authentication
│   ├── customer-service/             # Customer profiles and registration event publisher
│   ├── credit-score/                 # Credit scores and Kafka event listener
│   ├── loan-type-service/            # Loan-product catalog
│   ├── loan-application/             # Applications, interest calculation, PAN uploads
│   └── loan-officer-service/          # Officer review and application decisions
└── postman/                          # Postman workspace globals
```

Each backend service is a separate Maven project; there is no root Maven aggregator.

---

## 📋 Prerequisites

Install and start the following before running the whole system:

- Java 17 (set `JAVA_HOME`)
- Node.js and npm
- Oracle Database with a reachable service (the checked-in local configuration uses `localhost:1521/freepdb1`)
- Apache Kafka on `localhost:9092`
- A browser

The Maven Wrapper (`mvnw.cmd` on Windows, `./mvnw` on macOS/Linux) downloads Maven automatically. No global Maven installation is required.

---

## ⚙️ Configuration

### Backend configuration

Every service is configured in `Backend/<service>/src/main/resources/application.properties`. The default local configuration expects:

| Dependency | Default |
| --- | --- |
| Eureka | `http://localhost:8761/eureka/` |
| Kafka | `localhost:9092` |
| Oracle | `jdbc:oracle:thin:@//localhost:1521/freepdb1` |
| Oracle user | `system` |

`auth-service` supports an `AUTH_DB_URL` environment variable for its datasource URL and `AUTH_JWT_EXPIRY_SECONDS` for token lifetime. For a real deployment, keep database credentials and JWT secrets outside version control (environment variables, a secret manager, or an external configuration server) and use database migrations instead of Hibernate schema updates.

### Frontend configuration

Create `Frontend/.env.local` with the gateway address:

```dotenv
VITE_API_BASE_URL=http://localhost:9000
```

The Vite development server also proxies `/api` to port `9000`; using the explicit variable above is the most predictable setup for local development.

---

## 🚀 Getting Started

Start components in this order. Open a separate terminal for each backend service.

1. Start Oracle Database and Kafka.
2. Start the Eureka registry:

   ```powershell
   cd Backend/service-registry
   .\mvnw.cmd spring-boot:run
   ```

3. Start the domain services (order among these is not important after Eureka is available):

   ```powershell
   cd Backend/auth-service; .\mvnw.cmd spring-boot:run
   cd Backend/customer-service; .\mvnw.cmd spring-boot:run
   cd Backend/credit-score; .\mvnw.cmd spring-boot:run
   cd Backend/loan-type-service; .\mvnw.cmd spring-boot:run
   cd Backend/loan-application; .\mvnw.cmd spring-boot:run
   cd Backend/loan-officer-service; .\mvnw.cmd spring-boot:run
   ```

4. Start the gateway:

   ```powershell
   cd Backend/api-gateway
   .\mvnw.cmd spring-boot:run
   ```

5. Start the frontend:

   ```powershell
   cd Frontend
   npm install
   npm run dev
   ```

Open the URL printed by Vite (normally `http://localhost:5173`). Confirm service registrations at `http://localhost:8761` before testing gateway routes.

---

## 🔌 Services and Ports

| Service | Port | Responsibility |
| --- | ---: | --- |
| Service Registry | 8761 | Eureka service discovery server |
| API Gateway | 9000 | Public API entry point, JWT validation and identity-header forwarding |
| Auth Service | 8000 | Customer and officer login, JWT issuance |
| Customer Service | 8001 | Customer registration and profile retrieval; publishes registration events |
| Credit Score Service | 8002 | Credit-score lookup/audit functions; consumes customer-registration events |
| Loan Type Service | 8081 | Loan-product catalog and management |
| Loan Application Service | 8083 | Applications, calculated rates, status updates, PAN-card storage/retrieval |
| Loan Officer Service | 9001 | Officer-side review and application decisions |

---

## 🔗 Public API

Call the API through `http://localhost:9000`, not the individual service ports. Routes configured by the gateway are:

| Path | Destination | Typical purpose |
| --- | --- | --- |
| `/api/v1/auth/**` | Auth service | Customer/officer login |
| `/api/customers/**` | Customer service | Customer registration and profile operations |
| `/api/credit-scores/**` | Credit-score service | Officer credit-score checks and viewed-application lookup |
| `/api/loan-types/**` | Loan-type service | Browse, search, and manage loan products |
| `/api/v1/loan-applications/**` | Loan-application service | Calculate rates, create/retrieve/update applications, download PAN images |
| `/api/loan-officer/**` | Loan-officer service | Officer application review, decisions, and document viewing |

### Authentication

Authenticate using one of these endpoints:

```http
POST /api/v1/auth/customers/login
POST /api/v1/auth/officers/login
Content-Type: application/json

{ "email": "user@example.com", "password": "your-password" }
```

Use the returned access token on protected requests:

```http
Authorization: Bearer <access-token>
```

The gateway validates the token and forwards identity/role headers such as `X-Customer-Id`, `X-Officer-Id`, and `X-User-Role` to downstream services. These headers are an internal gateway-to-service contract; clients should supply a valid bearer token rather than relying on manually set identity headers.

### Representative operations

| Operation | Method and path | Access |
| --- | --- | --- |
| Register a customer | `POST /api/customers/register` | Public |
| Browse loan types | `GET /api/loan-types` | Public |
| Search loan types | `GET /api/loan-types/search?name=...` | Public |
| Create/update/delete a loan type | `POST/PUT/DELETE /api/loan-types` | Loan officer |
| Calculate interest | `POST /api/v1/loan-applications/calculate-interest-rate` | Customer |
| Submit an application | `POST /api/v1/loan-applications` (multipart) | Customer |
| View own applications | `GET /api/v1/loan-applications/me` | Customer |
| View pending applications | `GET /api/v1/loan-applications/pending` | Loan officer |
| Update application status | `PATCH /api/v1/loan-applications/{id}/status` | Loan officer |
| Approve/reject through officer workflow | `PUT /api/loan-officer/applications/{id}/approve` or `/reject` | Loan officer |
| Check a credit score | `POST /api/credit-scores/check` | Loan officer |

Refer to the request and response DTOs beside each service controller for the exact JSON schema and validation rules.

---

## 👥 User Flows

### Customer

1. Register an account.
2. Sign in and receive a JWT.
3. Browse available loan products and calculate an indicative interest rate.
4. Submit a loan application with the required application fields and a `panCardImage` file as multipart form data.
5. Review submitted applications and their current status.

### Loan officer

1. Sign in through the officer login endpoint.
2. Browse all or pending applications.
3. Review application details, credit-score information, and PAN-card images.
4. Approve or reject an application, including the relevant decision request payload.
5. Create, update, or retire loan products as needed.

---

## 🧪 Project Highlights

### Customer registration and sessions

Registration captures a customer's name, date of birth, email, password, PAN number, employment type, and monthly income. Customer Service normalizes email and PAN values, prevents duplicates, hashes the password with BCrypt, and publishes the registration event. The frontend can persist a remembered login in `localStorage` or a temporary session in `sessionStorage` and adds the bearer token to API requests.

### Loan products and applications

A loan product defines its base interest rate, maximum loan amount, maximum tenure, collateral requirement, loan-to-value (LTV) limit, and description. The customer application experience provides a rate estimate and EMI calculation before submission. The backend validates the same business rules as the client:

- Requested amount must not exceed the product maximum.
- Requested tenure must not exceed the product maximum.
- Collateral-backed products require an asset valuation.
- The requested amount must comply with the product LTV limit.
- PAN-card uploads must be JPEG or PNG and no larger than 5 MB.

Applications are submitted as multipart data with an `application` JSON part and a `panCardImage` file part. The application record retains the image, content type, filename, and size. The current interest-rate calculation begins with the product base rate and adjusts for tenure; it does not yet consume live market or credit-bureau data.

### Officer workflow and credit history

Loan officers can filter the application queue by pending, approved, rejected, or all applications. The officer workflow enriches applications with customer details, supports PAN-image review, retrieves a mock credit score and risk label, and records each credit-history lookup. Approval records the selected principal, rate, tenure, and valuation; rejection requires a reason that is shown to the customer. An approved application creates a `LoanHistory` record with an active-loan status.

---

## 📬 Event Flow

When a customer registers, Customer Service publishes a `customer.registered` Kafka event containing the customer identifier and PAN number. Credit Score Service consumes that event and seeds the corresponding deterministic mock credit-score record. Kafka must be available for this registration-to-credit-score workflow.

---

## 💻 Development Commands

Frontend:

```powershell
cd Frontend
npm run dev      # development server
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build
```

Backend, from any service directory:

```powershell
.\mvnw.cmd test
.\mvnw.cmd package
.\mvnw.cmd spring-boot:run
```

On macOS/Linux, replace `.\mvnw.cmd` with `./mvnw`.

---

## ✅ Testing

Backend services include Spring Boot tests, with focused tests around customer-registration event publishing, credit-score event consumption, loan-type management, and application contexts. Run tests individually because each service has its own Maven project:

```powershell
cd Backend/customer-service
.\mvnw.cmd test
```

The frontend currently provides build and lint scripts. Add component and end-to-end tests as the UI evolves.

---

## 🔒 Production Notes

This repository is set up for local development. Before production use, at minimum:

- Move all database credentials and JWT keys to secure runtime configuration.
- Replace `ddl-auto=update`/`validate` workflow with versioned migrations (for example, Flyway).
- Configure CORS, TLS, trusted proxy settings, and secure cookie/token handling for the deployed frontend domain.
- Use managed, authenticated Kafka and database services; define topics, retention, retries, and dead-letter handling.
- Add centralized configuration, observability (logs, metrics, traces), health checks, rate limiting, and CI/CD quality gates.
- Store uploaded documents in secure object storage rather than database/application-local storage where appropriate; enforce file type, size, malware-scanning, retention, and access-control policies.

---

## ⚠️ Current Implementation Limits

- Credit scores are deterministic mock data, not a credit-bureau integration.
- The backend supports an `UNDER_REVIEW` application state, while the current officer UI exposes approve and reject actions rather than a separate mark-under-review action.
- Loan Application Service calls Loan Type Service through its configured local URL; the other service integrations use Eureka discovery where configured.
- Downstream services trust identity headers set by the gateway. Keep their ports private in any deployed environment so callers cannot bypass gateway validation.
- Services have module-level tests, but the repository does not provide a complete system integration test run against Oracle, Kafka, and Eureka.

---

## 🤝 Contributing

1. Create a focused branch from the current integration branch.
2. Keep changes scoped to the relevant service or UI feature.
3. Run the affected service tests and frontend lint/build checks.
4. Do not commit credentials, local databases, `target/`, `.m2/`, IDE metadata, or generated artifacts.
5. Open a pull request with a concise description, testing evidence, and any configuration changes.

---

## 📄 License

No license file is currently included. Add a `LICENSE` file before distributing or reusing this project publicly.
