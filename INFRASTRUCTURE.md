# RoomieRules Infrastructure Overview

## Tech Stack
- **Frontend:** Next.js (App Router) + React
- **Styling:** Tailwind CSS
- **State Management:** React state (local), no global store yet
- **Authentication:** Custom username/password with hashed passwords (bcrypt), Prisma ORM
- **Database:** PostgreSQL (hosted on Neon, managed via Prisma)
- **PDF/AI:** Not yet implemented (planned: react-pdf, pdfmake, CursorAI)

## Authentication Flow
- Users register and log in with username, email, and password
- Passwords are hashed with bcrypt before storage
- API routes for login and registration are implemented in the App Router (`src/app/api/`)
- No session/cookie management yet (planned)

## Database
- **Provider:** Neon (cloud Postgres)
- **ORM:** Prisma
- **User Model:**
  - `id` (autoincrement)
  - `username` (unique)
  - `email` (unique)
  - `passwordHash`
  - `createdAt`
- Prisma schema and migrations are managed in `/prisma/`

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
  - `dashboard/` — User dashboard (with layout)
  - `api/` — API routes for login and registration
- `prisma/` — Prisma schema and migrations
- `src/generated/prisma/` — Generated Prisma client

## Outstanding/Planned
- Session/cookie-based authentication and route protection
- PDF generation, AI features
- More dashboard features
- Production deployment and CI/CD 