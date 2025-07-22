RoomieRules – Flatmate Agreement Generator (UK-Focused)

⚒️ Tech Stack

Frontend: Next.js (App Router) + React (with Tailwind for UI)

Hosting: Vercel (CI/CD built-in)

Auth: Optional (e.g. Clerk/Auth.js) – but MVP can skip login

Data Handling: LocalStorage or Prisma + SQLite/PostgreSQL

AI Help: CursorAI (for code generation, form generation logic, UI templates)

PDF Generation: react-pdf or pdfmake

State Management: React state or Zustand

✅ MVP Features

Feature

Description

🎯 Flatmate Quiz

Users answer a series of yes/no or multiple choice questions.

🧳 Agreement Builder

Based on answers, generate a formatted tenancy/house agreement.

📄 PDF Export

Button to generate and download a neat, printable PDF.

🎛️ Editable Clauses

Let users tweak key parts (e.g., quiet hours, guests policy).

🇬🇧 UK Legal Suggestions

Pre-built clauses for common UK flatmate issues (cleaning, council tax).

🧠 Implementation Plan with CursorAI & Next.js

Phase 1: Scaffold & Setup

Initialize Next.js app: npx create-next-app roomierules

Install Tailwind CSS: npx tailwindcss init -p

Set up CursorAI in your dev environment

Create basic page routes: /, /quiz, /review, /generate, /download

Phase 2: Build Core Features

Quiz Component

Generate dynamic multi-step form

Save responses in local state or Context API

Agreement Generator

Populate Markdown/HTML template from logic tree based on answers

PDF Export

Use react-pdf or pdfmake to export filled-in agreement

Preview Page

Show full agreement for review before export

Allow inline editing of clauses

Phase 3: UI Polish

Add Tailwind styling

Add progress bar / breadcrumb in quiz

Add mobile responsiveness

Add basic favicon and branding

Phase 4: Deploy

Push to GitHub

Link to Vercel and deploy

Add environment variables if needed

💰 Monetization Options (Post-MVP)

Export to PDF = free (watermarked), or £4.99 for watermark-free + bonus clauses

Optional “Landlord Pack” with signature box + custom logos

Add Stripe checkout (via stripe/stripe-js or Vercel serverless functions)

📢 Promotion Plan (Free & Targeted)

Channel

What to Post

Reddit (r/UniUK, r/AskUK, r/UKPersonalFinance)

“We made a free tool to create flatmate agreements – what do you think?”

Facebook Groups

Post in student and renting groups (e.g. “Leeds Student Housing”)

Gumtree

Post ad offering the tool for free to renters

Product Hunt

Launch once it’s polished

Discords

Share in uni or young adult communities

🚀 Optional Nice-to-Haves (Post-Launch)

Auth (save & revisit agreements)

Prebuilt templates for students, professionals, or HMO

Shared rota generator

Council tax calculator