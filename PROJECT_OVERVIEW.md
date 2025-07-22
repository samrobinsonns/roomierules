# RoomieRules – Project Overview

## Infrastructure & Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (custom palette, mobile-first, modern UI)
- **Database:** PostgreSQL (Neon, managed via Prisma ORM)
- **ORM:** Prisma (with migrations, type safety)
- **Authentication:** Custom username/email + password (bcrypt-hashed)
- **State Management:** React state (local)
- **Deployment:** Vercel (CI/CD ready)

## User Roles
- **Admin:** Full access, user management, can change roles and delete users, view all properties
- **Landlord:** Property management, tenant invitations, document management
- **Tenant:** View assigned properties, accept invitations

## Main Pages & Features

### `/` (Landing Page)
- Comprehensive tenancy management platform overview
- Hero section with clear value proposition for landlords and property developers
- Feature showcase with 6 key areas: Property Management, Tenant Management, Multi-Tenancy, Document Management, Admin Tools, Modern Interface
- Call-to-action sections for registration and sign-in
- Professional footer with branding

### `/login`
- Login form (username + password)
- Modern, mobile-friendly card UI
- Error handling for invalid credentials
- Link to registration

### `/register`
- Registration form (username, email, password)
- Modern, mobile-friendly card UI
- Error handling for duplicate users, missing fields
- Link to login

### `/dashboard`
- User's main area after login
- Role-based dashboard showing relevant information
- Landlords see property management options
- Tenants see their assigned properties
- Admins see system-wide overview

### `/properties`
- **Landlord/Admin access** - Property management hub
- Card and list view toggle with localStorage persistence
- Add, edit, delete properties
- Property search and filtering (planned)
- Responsive design with 98% width utilization

### `/properties/[id]`
- **Property detail page** with 2/3 layout for details, 1/3 for tenants
- Property information display (address, type, rooms, description)
- Tenant management with invitation system
- Document upload and storage
- Invitation status tracking and management

### `/admin`
- **Admin-only** (protected route)
- User management: list all users, change roles, delete users
- Modern, mobile-friendly table UI
- Error/loading states

### `/landlord`
- Legacy landlord dashboard (household management)
- Modern, friendly card UI

### `/tenant`
- Tenant-specific dashboard showing property memberships
- Modern, friendly card UI

### `/invite/[token]`
- Invitation acceptance page for tenants
- Secure token-based invitation system
- User account creation for invited tenants

### Navigation
- Responsive, sticky navbar with logo, user avatar, and role-based links
- Only shows links relevant to the user's role (admin, landlord, tenant)
- Mobile hamburger menu
- Properties link for landlords and admins

## API Endpoints
- `/api/login` – Login (POST)
- `/api/register` – Register (POST)
- `/api/me` – Get current user (GET)
- `/api/admin/users` – List all users (GET, admin only)
- `/api/admin/users/role` – Change user role (POST, admin only)
- `/api/admin/users/delete` – Delete user (POST, admin only)
- `/api/admin/users/promote` – Promote user to admin (POST, admin only)
- `/api/landlord/properties` – Property CRUD operations (GET, POST)
- `/api/landlord/properties/[id]` – Individual property operations (GET, PUT, DELETE)
- `/api/landlord/properties/invite-tenant` – Invite tenant to property (POST)
- `/api/landlord/properties/assign-tenant` – Assign existing user to property (POST)
- `/api/landlord/properties/remove-tenant` – Remove tenant from property (POST)
- `/api/landlord/properties/revoke-invitation` – Revoke pending invitation (POST)
- `/api/invite/[token]` – Get invitation details (GET)
- `/api/invite/[token]/accept` – Accept invitation (POST)

## Key Features

### Property Management
- **CRUD Operations:** Create, read, update, delete properties
- **UK Address Fields:** Complete address with postcode validation
- **Property Types:** House, flat, studio, shared, student accommodation
- **Document Storage:** Upload and manage property documents
- **Multi-Tenancy:** Property isolation with owner-based access

### Tenant Management
- **Email Invitations:** Secure invitation system with unique tokens
- **Invitation Tracking:** Monitor pending and accepted invitations
- **Tenant Assignment:** Assign existing users to properties
- **Bulk Operations:** Manage multiple tenants efficiently

### User Experience
- **Responsive Design:** Mobile-first approach with wider layouts
- **View Persistence:** Card/list view preferences saved in localStorage
- **Modern UI:** Clean, professional interface with Tailwind CSS
- **Error Handling:** Comprehensive error messages and loading states

## Outstanding/Planned
- Real session/cookie-based authentication
- PDF generation for property documents and rental agreements
- Property analytics and reporting dashboard
- Maintenance request system
- Rent collection and payment tracking
- Property listing integration
- Mobile app development
- Real-time notifications
- Advanced search and filtering
- Property photo galleries
- Tenant screening and background checks

---

This document is up to date as of July 2025. For more technical details, see `INFRASTRUCTURE.md` or the codebase. 