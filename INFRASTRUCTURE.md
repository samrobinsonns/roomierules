# RoomieRules Infrastructure Overview

## Tech Stack
- **Frontend:** Next.js (App Router) + React
- **Styling:** Tailwind CSS
- **State Management:** React state (local), no global store yet
- **Authentication:** Custom username/password with hashed passwords (bcrypt), Prisma ORM
- **Database:** PostgreSQL (hosted on Neon, managed via Prisma)
- **PDF/AI:** Not yet implemented (planned: react-pdf, pdfmake, CursorAI)

## Multi-Tenancy Architecture
- **Households:** Core organizational unit for shared living spaces
- **Memberships:** Many-to-many relationship between users and households with roles
- **Roles:** 
  - `admin`: Full system access, can manage all users and households
  - `landlord`: Can create/manage households and invite/remove tenants
  - `tenant`: Can view household information and join via invite codes
- **Invite System:** Unique codes for household access control

## Authentication & Authorization Flow
- Users register and log in with username, email, and password
- Passwords are hashed with bcrypt before storage
- API routes for login and registration are implemented in the App Router (`src/app/api/`)
- Role-based access control for different dashboard views
- No session/cookie management yet (planned)

## Database Schema
- **Provider:** Neon (cloud Postgres)
- **ORM:** Prisma
- **Models:**
  - `User`: id, username, email, passwordHash, createdAt
  - `Household`: id, name, inviteCode, createdAt
  - `Membership`: id, userId, householdId, role, createdAt
- Prisma schema and migrations are managed in `/prisma/`

## Component Architecture
- **UI Components:** Reusable components in `src/components/ui/`
  - `Card`: Consistent card styling with border color variants
  - `Button`: Multiple variants (primary, secondary, danger, success) and sizes
  - `Input`: Standardized form inputs with focus states
- **Feature Components:** Domain-specific components in `src/components/`
  - `auth/`: LoginForm, RegisterForm
  - `dashboard/`: LandlordDashboard, TenantDashboard
- **Layout Components:** Navigation and layout structure

## API Routes
- **Authentication:** `/api/login`, `/api/register`, `/api/me`
- **Admin:** `/api/admin/users/promote`, `/api/admin/users/demote`, `/api/admin/users/delete`
- **Landlord:** `/api/landlord/households`, `/api/landlord/households/remove-tenant`
- **Tenant:** `/api/tenant/join` (planned)

## Role-Based Navigation & Access
- **Admin:** Access to Admin Tools, Landlord Dashboard, and all system features
- **Landlord:** Access to Landlord Dashboard for household management
- **Tenant:** Access to Tenant Dashboard showing household information
- **Navigation:** Dynamic based on user role and memberships

## Deployment
- **Local:** Next.js dev server
- **Production:** Planned for Vercel (CI/CD not yet set up)
- **Environment Variables:**
  - Database connection via `.env` (copied from `.env.local`)

## Project Structure (Key Parts)
- `src/app/` — App Router pages and layouts
  - `page.js` — Landing page
  - `login/page.js` — Login form
  - `register/page.js` — Registration form
  - `dashboard/` — Role-based dashboard (with layout)
  - `landlord/` — Landlord-specific features
  - `admin/` — Admin tools and user management
  - `api/` — API routes for all features
- `src/components/` — Reusable UI and feature components
  - `ui/` — Base UI components (Card, Button, Input)
  - `auth/` — Authentication forms
  - `dashboard/` — Dashboard-specific components
- `prisma/` — Prisma schema and migrations
- `src/generated/prisma/` — Generated Prisma client

## Outstanding/Planned
- Session/cookie-based authentication and route protection
- PDF generation, AI features
- More dashboard features (rules, chores, expenses)
- Production deployment and CI/CD
- Real-time notifications
- Mobile app development 