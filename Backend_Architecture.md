# HealthAI - Backend Architecture & Database Design

## 1. Technology Stack
- **Database:** Supabase (Managed PostgreSQL)
- **ORM:** Prisma (Modern, type-safe database client for Node.js)
- **Backend Framework:** Node.js with Express.js
- **Authentication:** Supabase Auth (JWT based)
- **Architecture Pattern:** Clean Architecture (Controller -> Service -> Repository)

---

## 2. Database Schema (Prisma)
Aşağıdaki şema, Supabase'deki PostgreSQL veritabanımızı şekillendirecek. Kullanıcılar, Projeler/İlanlar, NDA kayıtları ve Toplantı Talepleri arasında normalize edilmiş ilişkiler içerir.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Supabase Connection String
}

enum Role {
  DOCTOR
  ENGINEER
  ADMIN
}

enum MeetingStatus {
  PROPOSED
  NDA_ACCEPTED
  TIME_CONFIRMED
  CANCELLED
}

model User {
  id             String    @id @default(uuid())
  supabaseAuthId String    @unique // Links to Supabase Auth table
  email          String    @unique
  fullName       String
  role           Role
  specialization String    // e.g., "Radiology", "Software Engineering"
  institution    String    // edu.tr validation info
  isVerified     Boolean   @default(false)
  createdAt      DateTime  @default(now())
  
  posts           Post[]
  meetingRequests MeetingRequest[] @relation("Requester")
  meetingReceived MeetingRequest[] @relation("Receiver")
  ndaLogs         NdaLog[]
}

model Post {
  id          String   @id @default(uuid())
  title       String
  description String
  tags        String[] // Technical tags
  domain      String   // e.g., "AI in Imaging"
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  author      User     @relation(fields: [authorId], references: [id])
  ndaLogs     NdaLog[]
  meetings    MeetingRequest[]
}

model NdaLog {
  id          String   @id @default(uuid())
  postId      String
  userId      String
  signedAt    DateTime @default(now())
  ipAddress   String?  // For audit trails

  post        Post     @relation(fields: [postId], references: [id])
  user        User     @relation(fields: [userId], references: [id])

  @@unique([postId, userId]) // A user can sign an NDA for a post only once
}

model MeetingRequest {
  id             String        @id @default(uuid())
  postId         String
  requesterId    String
  receiverId     String
  proposedSlots  Json          // Array of proposed time slots
  confirmedSlot  DateTime?
  status         MeetingStatus @default(PROPOSED)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  post           Post          @relation(fields: [postId], references: [id])
  requester      User          @relation("Requester", fields: [requesterId], references: [id])
  receiver       User          @relation("Receiver", fields: [receiverId], references: [id])
}
```

---

## 3. API Endpoints (RESTful)

### Auth & Users
- `POST /api/auth/register` - Registers via Supabase Auth & creates User record.
- `POST /api/auth/login` - Returns JWT.
- `GET /api/users/profile` - Get verified professional identity.

### Posts (İlanlar / Projeler)
- `GET /api/posts` - List posts (Public info only, requires auth). Query params: `?domain=AI&tags=Python`.
- `POST /api/posts` - Create a new post (Only for verified professionals).
- `GET /api/posts/:id/details` - **Requires NDA Verification Middleware.** Returns full project data.

### NDA & Collaboration
- `POST /api/posts/:id/sign-nda` - Logs user's agreement to the NDA.

### Meetings (Toplantı & State Machine)
- `POST /api/meetings` - Request a meeting with `proposedSlots`. Fails if NDA not signed.
- `PATCH /api/meetings/:id/accept-nda` - State changes to `NDA_ACCEPTED`.
- `PATCH /api/meetings/:id/confirm-time` - User picks a slot, state -> `TIME_CONFIRMED`.

---

## 4. Clean Architecture Folder Structure

```text
backend/
├── src/
│   ├── config/          # Supabase & Prisma configurations
│   ├── controllers/     # Route handlers (Req/Res logic)
│   ├── middlewares/     # JWT Auth, NDA Verification checks
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic (State machines, validation)
│   ├── validators/      # Zod or Joi schemas for input validation
│   └── app.ts           # Express App setup
├── prisma/
│   └── schema.prisma    # Database models
├── package.json
└── .env
```
