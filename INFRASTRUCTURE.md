# RoomieRules Infrastructure Overview

## Tech Stack
- **Frontend:** Next.js (App Router) + React
- **Styling:** Tailwind CSS
- **State Management:** React state (local), no global store yet
- **Authentication:** Custom username/password with hashed passwords (bcrypt), Prisma ORM
- **Database:** PostgreSQL (hosted on Neon, managed via Prisma)
- **PDF/AI:** Not yet implemented (planned: react-pdf, pdfmake, CursorAI)

## Multi-Tenancy Architecture
- **Properties:** Core organizational unit for rental properties
- **Property Ownership:** Each property has an owner (landlord) with full management rights
- **Memberships:** Many-to-many relationship between users and properties with roles
- **Roles:** 
  - `admin`: Full system access, can manage all users and properties
  - `landlord`: Can create/manage properties and invite/remove tenants
  - `tenant`: Can view property information and join via invitation links
- **Invitation System:** Secure email-based invitations with unique tokens and expiration

## Authentication & Authorization Flow
- Users register and log in with username, email, and password
- Passwords are hashed with bcrypt before storage
- API routes for login and registration are implemented in the App Router (`src/app/api/`)
- Role-based access control for different dashboard views
- Temporary authentication using localStorage and `x-user-id` headers (planned: proper session management)

## Database Schema
- **Provider:** Neon (cloud Postgres)
- **ORM:** Prisma
- **Models:**
  - `User`: id, username, email, passwordHash, role, createdAt
  - `Property`: id, name, addressLine1, addressLine2, city, county, postcode, propertyType, bedrooms, bathrooms, description, ownerId, createdAt
  - `Document`: id, name, filename, fileType, fileSize, propertyId, createdAt
  - `Membership`: id, userId, propertyId, role, createdAt
  - `Invitation`: id, token, email, propertyId, invitedById, invitedUserId, status, expiresAt, createdAt
- Prisma schema and migrations are managed in `/prisma/`

## Component Architecture
- **UI Components:** Reusable components in `src/components/ui/`
  - `Card`: Consistent card styling with border color variants and clickable support
  - `Button`: Multiple variants (primary, secondary, danger, success) and sizes
  - `Input`: Standardized form inputs with focus states
- **Feature Components:** Domain-specific components in `src/components/`
  - `auth/`: LoginForm, RegisterForm
  - `dashboard/`: LandlordDashboard, TenantDashboard
  - `property/`: PropertyForm, PropertyCard, TenantAssignmentModal
- **Layout Components:** Navigation and layout structure

## API Routes
- **Authentication:** `/api/login`, `/api/register`, `/api/me`
- **Admin:** `/api/admin/users/promote`, `/api/admin/users/role`, `/api/admin/users/delete`
- **Landlord:** 
  - `/api/landlord/properties` (GET, POST)
  - `/api/landlord/properties/[id]` (GET, PUT, DELETE)
  - `/api/landlord/properties/assign-tenant` (POST)
  - `/api/landlord/properties/remove-tenant` (POST)
  - `/api/landlord/properties/invite-tenant` (POST)
  - `/api/landlord/properties/revoke-invitation` (POST)
  - `/api/landlord/households` (legacy)
- **Invitations:** `/api/invite/[token]`, `/api/invite/[token]/accept`

## Role-Based Navigation & Access
- **Admin:** Access to Admin Tools, Properties page, and all system features
- **Landlord:** Access to Properties page for property management
- **Tenant:** Access to Tenant Dashboard showing property information
- **Navigation:** Dynamic based on user role and property memberships

## Property Management Features
- **Property CRUD:** Create, read, update, delete properties with UK address fields
- **Document Management:** Upload and store property-related documents
- **Tenant Invitations:** Email-based invitation system with secure tokens
- **View Modes:** Card and list view with localStorage persistence
- **Multi-Tenancy:** Property isolation with owner-based access control
- **Responsive Design:** Mobile-first design with wider layouts (98% width)

## Deployment
- **Local:** Next.js dev server
- **Production:** Planned for Vercel (CI/CD not yet set up)
- **Environment Variables:**
  - Database connection via `.env` (copied from `.env.local`)

## Project Structure (Key Parts)
- `src/app/` — App Router pages and layouts
  - `page.js` — Landing page (tenancy management focus)
  - `login/page.js` — Login form
  - `register/page.js` — Registration form
  - `dashboard/` — Role-based dashboard (with layout)
  - `properties/` — Property management pages
  - `properties/[id]/` — Property detail pages
  - `landlord/` — Landlord-specific features
  - `admin/` — Admin tools and user management
  - `invite/[token]/` — Invitation acceptance pages
  - `api/` — API routes for all features
- `src/components/` — Reusable UI and feature components
  - `ui/` — Base UI components (Card, Button, Input)
  - `auth/` — Authentication forms
  - `dashboard/` — Dashboard-specific components
  - `property/` — Property management components
- `prisma/` — Prisma schema and migrations
- `src/generated/prisma/` — Generated Prisma client

## Outstanding/Planned
- Session/cookie-based authentication and route protection
- PDF generation for property documents and agreements
- AI features for property analysis and tenant screening
- More dashboard features (rental agreements, maintenance requests, expenses)
- Production deployment and CI/CD
- Real-time notifications
- Mobile app development
- Property analytics and reporting
- Integration with property listing platforms 