# HealthAI: Medical & Engineering Co-Creation Platform

**SENG384 - Software Engineering Requirements and Design**

HealthAI is a specialized, secure SaaS platform designed to bridge the gap between medical professionals and engineers. It facilitates cross-disciplinary collaboration on cutting-edge healthcare technology projects (such as AI in Radiology, Genomic Sequencing, etc.) while strictly adhering to medical data privacy standards.

---

## 🚀 Current Project Status (Progress Demo)

This repository contains the current working prototype of the HealthAI platform. It features a modern, glassmorphism-based UI and a fully functional backend connected to a live PostgreSQL database.

### ✅ Fully Implemented & Working Features (Full-Stack)
The following features are connected end-to-end to our Node.js backend and Supabase PostgreSQL database:

*   **Authentication & Validation:** User registration and login flows, specifically enforcing institutional email (`.edu.tr`) validations.
*   **Dynamic Dashboard & Posts:** The core feed ("Global Research Pulse") dynamically fetches real data from the backend.
*   **Collaboration Creation:** Users can successfully publish new project/collaboration requests that immediately persist to the database.
*   **Smart Recommendations Engine:** The recommendations panel analyzes real posts in the database to suggest collaborations.
*   **NDA & Meeting Request State Machine (Core Business Logic):** 
    *   Users can send a "Meeting Request" with 3 proposed time slots.
    *   This action automatically signs a digital Non-Disclosure Agreement (NDA) which is logged securely (`NdaLog` table) with timestamps and IP records.
    *   The receiving user can view incoming requests, select a time, and confirm the meeting, which updates the state from `PROPOSED` to `SCHEDULED` in the database.

### 🎨 Visual & UI Mockups (Pending Integration)
The following features are currently implemented purely on the frontend for visual design and UX demonstration purposes. Their backend logic will be finalized before the final release:

*   **Messages Tab:** The chat interface is visually complete but currently uses mock data.
*   **Profile Page:** The user profile settings and portfolio views are UI representations.
*   **Admin Dashboard:** The platform moderation interface is visually designed but not yet wired to the backend auth roles.

---

## 💻 Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Framer Motion (for micro-animations)
*   **Backend:** Node.js, Express.js
*   **Database & ORM:** PostgreSQL (hosted on Supabase), Prisma ORM
*   **Design Aesthetics:** Dark-mode glassmorphism, responsive grid layouts

---

## 🛠 How to Run Locally

If you have the `.env` file provided by the team, you can run the application locally in two terminals:

**1. Start the Backend (Port 3000):**
```bash
cd backend
npm install
npm run dev
```

**2. Start the Frontend (Port 5173):**
```bash
cd frontend
npm install
npm run dev
```

*Note: A Docker Compose configuration is planned for the final submission to allow 1-click startup.*
