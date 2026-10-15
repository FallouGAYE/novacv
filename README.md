<div align="center">

# ✦ NovaCV

### Build your future. Design your career.

**A modern, powerful, and customizable resume builder.**

Create beautiful, professional resumes with an intuitive editor, flexible templates, and seamless PDF export.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

<br />

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?style=flat-square&logo=pnpm&logoColor=white)

<br />

![Status](https://img.shields.io/badge/Status-Active%20Development-blue?style=flat-square)
![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-purple?style=flat-square)
![License](https://img.shields.io/badge/License-Private-lightgrey?style=flat-square)

<br />

**[Overview](#-overview) · [Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [Roadmap](#-roadmap)**

</div>

---

## 🌟 Overview

**NovaCV** is a modern SaaS platform designed to simplify the creation, management, and customization of professional resumes.

Our mission is simple:

> Empower everyone to create a professional resume that reflects their skills, experience, and ambitions.

NovaCV aims to combine an intuitive user experience with a reliable, secure, and scalable technical architecture.

The platform is being developed with modern web technologies, clean architecture principles, and a strong focus on maintainability.

### 🎯 Our Vision

Creating a professional resume should be simple, accessible, and enjoyable.

NovaCV aims to provide:

- 🎨 Beautiful and customizable resume templates.
- ⚡ A fast and intuitive resume-building experience.
- 📄 High-quality PDF exports.
- 🔒 Secure management of personal information.
- 🌍 Multilingual resume creation.
- 📱 A responsive experience across devices.
- 🤖 Intelligent writing assistance in future releases.

---

## ✨ Features

NovaCV is under active development.

The following table distinguishes implemented functionality from planned features.

| Feature | Description | Status |
|:---|:---|:---:|
| User Registration | Create an account using email and password | ✅ |
| User Authentication | Secure login with JWT | ✅ |
| Password Security | Password hashing with Argon2 | ✅ |
| Protected API Routes | JWT-based route protection | ✅ |
| User Profile | Retrieve authenticated user information | ✅ |
| Resume Database Model | PostgreSQL schema for user resumes | ✅ |
| Resume Repository | Prisma implementation of resume persistence | ✅ |
| Resume REST API | Create, read, update, and delete resumes | 🚧 |
| Resume Dashboard | Manage multiple resumes | 📋 |
| Resume Editor | Edit resume sections interactively | 📋 |
| Resume Templates | Professional and customizable designs | 📋 |
| Live Preview | Real-time resume visualization | 📋 |
| PDF Export | Download resumes as PDF files | 📋 |
| Multilingual Support | Create resumes in multiple languages | 📋 |
| AI Writing Assistant | Improve resume content with AI | 📋 |
| Premium Plans | Advanced features and subscriptions | 📋 |

**Legend**

- ✅ Implemented
- 🚧 In progress
- 📋 Planned

---

## 🛠️ Tech Stack

NovaCV uses a modern TypeScript ecosystem.

### Frontend

| Technology | Purpose |
|:---|:---|
| Next.js | React-based web application |
| React | User interface development |
| TypeScript | Type-safe frontend development |

The frontend application and visual resume editor are planned for upcoming development phases.

### Backend

| Technology | Purpose |
|:---|:---|
| NestJS 12 | Backend framework |
| Node.js 22 | JavaScript runtime |
| TypeScript | Type-safe backend development |
| Prisma 7 | Database ORM |
| PostgreSQL | Relational database |
| Zod | Request and data validation |
| JWT | Token-based authentication |
| Argon2 | Secure password hashing |

### Development & Infrastructure

| Technology | Purpose |
|:---|:---|
| Docker | Containerized development services |
| pnpm | Package management |
| Vitest | Unit testing |
| Supertest | HTTP integration testing |
| Oxlint | Static code analysis |
| Git | Version control |
| GitHub | Source code hosting |

---

## 🏗️ Architecture

NovaCV follows a **Modular Monolith Architecture**, designed around separation of concerns and SOLID principles.

The backend is organized into independent business modules.

Each module follows a layered structure:

```text
┌──────────────────────────────────────────────┐
│                  NovaCV                      │
├──────────────────────────────────────────────┤
│                                              │
│              Frontend Layer                  │
│              Next.js + React                 │
│                  (Planned)                   │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│                REST API                      │
│                  NestJS                      │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│              Business Modules                │
│                                              │
│       ┌────────┐  ┌────────┐  ┌────────┐     │
│       │  Auth  │  │ Users  │  │Resumes │     │
│       └────────┘  └────────┘  └────────┘     │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│             Persistence Layer                │
│                                              │
│                 Prisma ORM                   │
│                      │                       │
│                 PostgreSQL                   │
│                                              │
└──────────────────────────────────────────────┘
```

### Architecture Principles

The project emphasizes:

- **Single Responsibility Principle:** Each component has a clearly defined responsibility.
- **Dependency Inversion:** Business logic depends on abstractions rather than concrete database implementations.
- **Separation of Concerns:** Domain, application, infrastructure, and presentation layers are separated.
- **Modularity:** Features are organized into independent modules.
- **Type Safety:** TypeScript is used across the application.
- **Testability:** Business logic and HTTP endpoints are designed to be independently tested.

### Backend Layers

| Layer | Responsibility |
|:---|:---|
| Domain | Business entities and repository interfaces |
| Application | Business use cases and application services |
| Infrastructure | Database access and external implementations |
| Presentation | HTTP controllers, DTOs, and authentication guards |

---

## 📁 Project Structure

The following tree presents the main backend modules and the planned frontend organization.

```text
novacv/
│
├── apps/
│   │
│   ├── api/
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   │
│   │   ├── src/
│   │   │   │
│   │   │   ├── common/
│   │   │   │   └── pipes/
│   │   │   │
│   │   │   ├── config/
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   └── database/
│   │   │   │
│   │   │   ├── modules/
│   │   │   │   │
│   │   │   │   ├── auth/
│   │   │   │   │   ├── domain/
│   │   │   │   │   ├── application/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   └── auth.module.ts
│   │   │   │   │
│   │   │   │   ├── users/
│   │   │   │   │   ├── domain/
│   │   │   │   │   ├── application/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   └── users.module.ts
│   │   │   │   │
│   │   │   │   └── resumes/
│   │   │   │       ├── domain/
│   │   │   │       ├── application/
│   │   │   │       ├── infrastructure/
│   │   │   │       └── presentation/
│   │   │   │
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   │
│   │   └── package.json
│   │
│   └── web/                     # Planned frontend
│
└── README.md
```

---

## 🔐 Authentication & Security

Security is an important part of NovaCV's architecture.

### Implemented Security Measures

**Password Protection**

User passwords are hashed using Argon2 before being stored in PostgreSQL.

Plain-text passwords are not stored in the database.

**JWT Authentication**

NovaCV uses JSON Web Tokens for authenticated API access.

Access tokens are signed using the HS256 algorithm.

**Token Expiration**

Access tokens have a configured lifetime of 15 minutes.

**Protected Routes**

Sensitive endpoints use a dedicated JWT authentication guard.

**Input Validation**

Incoming request data is validated using Zod schemas.

**Data Isolation**

Resume repository operations are scoped to the authenticated user's identifier.

This design helps prevent users from accessing or modifying resumes belonging to other accounts.

### Security Improvements Planned

- Rate limiting.
- Secure password reset.
- Email verification.
- Refresh token management.
- Security headers.
- Audit logging.
- Additional authorization tests.
- Production security review.

---

## 🗄️ Database Design

NovaCV uses PostgreSQL with Prisma ORM.

### Current Models

#### User

Represents a registered user.

| Field | Type | Description |
|:---|:---|:---|
| id | UUID | Unique identifier |
| email | String | Unique email address |
| passwordHash | String? | Hashed password |
| firstName | String? | First name |
| lastName | String? | Last name |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last modification timestamp |

#### Resume

Represents a resume belonging to a user.

| Field | Type | Description |
|:---|:---|:---|
| id | UUID | Unique resume identifier |
| userId | UUID | Resume owner |
| title | String | Resume title |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last modification timestamp |

### Database Relationship

```text
┌──────────────────┐
│       User       │
├──────────────────┤
│ id               │
│ email            │
│ passwordHash     │
│ firstName        │
│ lastName         │
│ createdAt        │
│ updatedAt        │
└────────┬─────────┘
         │
         │ 1
         │
         │ N
         ▼
┌──────────────────┐
│      Resume      │
├──────────────────┤
│ id               │
│ userId           │
│ title            │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
```

**Relationship:** One user can own multiple resumes.

Resume records reference their owner through `userId`.

The relationship uses cascading deletion at the database level.

---

## 🌐 REST API

The backend exposes REST endpoints for authentication and user management.

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|:---|:---|:---|:---:|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Authenticate a user | No |
| GET | `/auth/me` | Retrieve the current user | JWT |

### Planned Resume Endpoints

| Method | Endpoint | Description | Authentication |
|:---|:---|:---|:---:|
| POST | `/resumes` | Create a resume | JWT |
| GET | `/resumes` | List user resumes | JWT |
| GET | `/resumes/:id` | Retrieve a resume | JWT |
| PATCH | `/resumes/:id` | Update a resume | JWT |
| DELETE | `/resumes/:id` | Delete a resume | JWT |

These resume endpoints are not yet exposed by the application.

### Example: Register a User

**Request**

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "email": "developer@example.com",
  "password": "SecurePassword123!",
  "firstName": "Alex",
  "lastName": "Martin"
}
```

**Successful Response — 201 Created**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "developer@example.com",
  "firstName": "Alex",
  "lastName": "Martin"
}
```

### Example: Login

**Request**

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "developer@example.com",
  "password": "SecurePassword123!"
}
```

**Successful Response — 200 OK**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "developer@example.com",
  "accessToken": "<JWT_ACCESS_TOKEN>",
  "tokenType": "Bearer"
}
```

### Example: Access a Protected Route

```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

A valid token returns the authenticated user's profile.

Missing, invalid, or expired tokens are rejected with HTTP `401 Unauthorized`.

---

## 🚀 Getting Started

> NovaCV is currently under active development. The following instructions focus on the backend development environment.

### Prerequisites

Make sure the following tools are installed:

- Node.js 22
- pnpm 10
- Docker
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd novacv
```

Replace `<YOUR_REPOSITORY_URL>` with the actual Git repository URL.

### 2. Install Dependencies

From the API directory:

```bash
cd apps/api
pnpm install
```

### 3. Configure Environment Variables

Create or update the backend `.env` file:

```env
NODE_ENV=development

PORT=3001

DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@127.0.0.1:5433/novacv_db?schema=public"

JWT_ACCESS_SECRET="REPLACE_WITH_A_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS"
```

**Important:** Replace all placeholder values with your local configuration.

Never commit real passwords, database credentials, or JWT secrets to Git.

### 4. Start PostgreSQL

Start the PostgreSQL service using the project's Docker configuration.

Verify that PostgreSQL is accessible through the connection URL configured in `.env`.

The current local development environment uses port `5433`.

### 5. Apply Database Migrations

```bash
pnpm exec prisma migrate dev
```

### 6. Generate Prisma Client

```bash
pnpm exec prisma generate
```

### 7. Start the Backend

```bash
pnpm start:dev
```

The development API should be available at:

```text
http://localhost:3001
```

### 8. Verify the API

```bash
curl -i http://localhost:3001/auth/me
```

Without an authentication token, the expected response is:

```http
HTTP/1.1 401 Unauthorized
```

This confirms that the protected endpoint is reachable and rejects unauthenticated requests.

---

## 🧪 Testing & Code Quality

NovaCV uses automated testing and static analysis to improve reliability.

### Testing Tools

| Tool | Purpose |
|:---|:---|
| Vitest | Unit tests |
| Supertest | HTTP integration tests |
| TypeScript | Static type checking |
| Oxlint | Code quality and linting |

### Run All Tests

From `apps/api`:

```bash
pnpm exec vitest run
```

### Run TypeScript Checks

```bash
pnpm exec tsc --noEmit
```

### Run Linting

```bash
pnpm lint
```

### Run Authentication HTTP Tests

```bash
pnpm exec vitest run \
  src/modules/auth/presentation/auth.controller.http.spec.ts
```

### Testing Strategy

The backend testing strategy covers:

- Authentication business logic.
- User registration.
- Login validation.
- JWT verification.
- Protected HTTP endpoints.
- Invalid credentials.
- Input validation.
- Sensitive data exposure.
- Unauthorized access.

Additional tests for resume ownership and persistence are planned.

---

## 🗺️ Roadmap

NovaCV is being developed incrementally.

### Phase 1 — Backend Foundation

- [x] Initialize the backend architecture.
- [x] Configure PostgreSQL.
- [x] Integrate Prisma ORM.
- [x] Implement environment validation.
- [x] Implement user registration.
- [x] Implement password hashing.
- [x] Implement JWT authentication.
- [x] Protect authenticated routes.
- [x] Implement user profile retrieval.
- [x] Add authentication tests.

### Phase 2 — Resume Management

- [x] Create the Resume database model.
- [x] Define the Resume repository interface.
- [x] Implement Prisma resume persistence.
- [ ] Add resume repository tests.
- [ ] Implement resume application services.
- [ ] Create resume DTOs and validation.
- [ ] Implement resume REST endpoints.
- [ ] Add authorization and ownership tests.

### Phase 3 — Resume Content

- [ ] Personal information.
- [ ] Professional summary.
- [ ] Work experience.
- [ ] Education.
- [ ] Technical skills.
- [ ] Languages.
- [ ] Projects.
- [ ] Certifications.
- [ ] Custom sections.
- [ ] Section reordering.

### Phase 4 — Frontend

- [ ] Authentication pages.
- [ ] User dashboard.
- [ ] Resume management interface.
- [ ] Interactive resume editor.
- [ ] Responsive layouts.
- [ ] Live preview.
- [ ] Form validation and feedback.

### Phase 5 — Templates & Export

- [ ] Professional resume templates.
- [ ] Color customization.
- [ ] Typography customization.
- [ ] A4 page layout.
- [ ] Multi-page resume support.
- [ ] PDF generation.
- [ ] PDF download.
- [ ] Print optimization.

### Phase 6 — Advanced SaaS Features

- [ ] Multilingual resume creation.
- [ ] Resume duplication.
- [ ] Shareable resume links.
- [ ] AI-assisted writing.
- [ ] ATS-oriented improvements.
- [ ] Premium subscriptions.
- [ ] Stripe integration.

### Phase 7 — Production

- [ ] Production environment configuration.
- [ ] CI/CD pipeline.
- [ ] Containerized deployment.
- [ ] Monitoring and logging.
- [ ] Automated backups.
- [ ] Performance optimization.
- [ ] Accessibility review.
- [ ] Security audit.

---

## 🎨 Design Philosophy

NovaCV is built around five principles.

### 01 — Simplicity

Creating a resume should not require technical knowledge.

### 02 — Professionalism

Every template should help users present their experience clearly and professionally.

### 03 — Customization

Users should have control over their resume's appearance and content.

### 04 — Performance

The application should remain fast, responsive, and efficient.

### 05 — Privacy

Personal information should be handled with care and protected by appropriate security measures.

---

## 🤝 Contributing

NovaCV is currently developed as a private project.

External contributions are not open at this stage.

Contribution guidelines may be introduced in a future release.

---

## 📄 License

**Copyright © 2026 NovaCV.**

All rights reserved.

This project is currently private and has not been released under an open-source license.

---

<div align="center">

### ✦ NovaCV

**Your experience. Your story. Your future.**

A modern resume-building platform.

Built with TypeScript, Next.js, NestJS, Prisma, and PostgreSQL.

<br />

**Made with care. Designed for the future.**

<br />

<sub>NovaCV © 2026 — All rights reserved.</sub>

</div>
