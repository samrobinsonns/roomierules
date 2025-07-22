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
- **Admin:** Full access, user management, can change roles and delete users
- **Landlord:** (Planned) Landlord-specific tools and features
- **Tenant:** (Planned) Tenant-specific tools and features

## Main Pages & Features

### `/` (Landing Page)
- Friendly, modern hero section with call-to-action
- Explains the app’s purpose (flatmate agreement generator)
- “Get Started Free” button links to registration

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
- User’s main area after login
- Welcoming message, playful icon
- Placeholder for future features (agreement builder, quiz, etc.)

### `/admin`
- **Admin-only** (protected route)
- User management: list all users, change roles, delete users
- Modern, mobile-friendly table UI
- Error/loading states

### `/landlord`
- Placeholder for landlord-specific tools (future)
- Modern, friendly card UI

### `/tenant`
- Placeholder for tenant-specific tools (future)
- Modern, friendly card UI

### Navigation
- Responsive, sticky navbar with logo, user avatar, and role-based links
- Only shows links relevant to the user’s role (admin, landlord, tenant)
- Mobile hamburger menu

## API Endpoints
- `/api/login` – Login (POST)
- `/api/register` – Register (POST)
- `/api/me` – Get current user (GET, currently mocked)
- `/api/admin/users` – List all users (GET, admin only)
- `/api/admin/users/role` – Change user role (POST, admin only)
- `/api/admin/users/delete` – Delete user (POST, admin only)
- `/api/admin/users/promote` – Promote user to admin (POST, admin only)

## Outstanding/Planned
- Real session/cookie-based authentication
- Agreement builder, quiz, PDF export
- Landlord/Tenant feature buildout
- User profile, settings, and notifications
- More onboarding and help content

---

This document is up to date as of July 2025. For more details, see `INFRASTRUCTURE.md` or the codebase. 