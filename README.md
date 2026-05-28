# Secure Student Management System (React + TS + Node + Mongo)

Production-ready full-stack **Student Management System** with:

- **Frontend**: React, TypeScript, Tailwind CSS, React Hook Form, Zod, React Query, Axios, React Router, CryptoJS
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, CryptoJS, Helmet, Morgan, dotenv

## Tech stack used

### Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- React Hook Form + Zod
- React Query
- Axios
- React Router
- CryptoJS (AES encryption/decryption in client flow)

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- Zod request validation
- Helmet + Morgan
- CryptoJS (server-side AES encryption/decryption)

## Features

- **Admin login** (JWT)
- **Student CRUD**: register, list, edit, delete
- **Responsive dashboard layout** (mobile → desktop)
- **Validation** on both client (Zod + RHF) and server (Zod middleware)
- **Loading / empty / error states**
- **2-level AES encryption for student data**

## Encryption flow (2-level AES)

### Save (Create/Update)

1. **Frontend** encrypts the full student payload with **AES_KEY_1**.
2. **Backend** decrypts level-1 payload (AES_KEY_1).
3. Backend bcrypt-hashes the password (**password is never AES-encrypted**).
4. **Backend** encrypts the stored student payload again with **AES_KEY_2** (server-only).
5. MongoDB stores only `encryptedData` (+ timestamps; plus `emailHash` to allow lookups).

### Fetch (List)

1. **Backend** decrypts DB payload with **AES_KEY_2**.
2. Backend re-encrypts the payload to level-1 using **AES_KEY_1**.
3. **Frontend** decrypts level-1 payload and renders plaintext student data.

## Project structure

### Frontend

`client/src/`

- `api/` axios instance
- `components/` reusable UI
- `hooks/` react-query hooks + toasts
- `layouts/` dashboard layout
- `pages/` login + students pages
- `routes/` routing + auth guard
- `schemas/` zod schemas
- `services/` API services + crypto integration
- `types/` shared TS types
- `utils/` crypto helpers

### Backend

`server/src/`

- `config/` env + db
- `controllers/` route handlers
- `middleware/` auth, validation, errors
- `models/` mongoose models
- `routes/` express routers
- `services/` business logic
- `types/` shared types
- `utils/` crypto + hashing
- `validations/` zod request schemas
- `app.ts`, `server.ts`

## Setup instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or Atlas)

### 1) Clone and install dependencies

```bash
git clone <repo-url>
cd full-stack-assignment
npm install
```

### 1) Backend

Create `server/.env` from `server/.env.example`.

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:4000`.

### 2) Frontend

Create `client/.env` from `client/.env.example`.

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment variables

### `server/.env`

- `MONGO_URI` MongoDB connection string
- `JWT_SECRET` JWT signing secret
- `JWT_EXPIRES_IN` e.g. `1d`
- `AES_KEY_1` frontend/shared AES key (level-1)
- `AES_KEY_2` server-only AES key for DB at-rest encryption (level-2)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` admin bootstrap user
- `CORS_ORIGIN` frontend origin

### `client/.env`

- `VITE_API_BASE_URL` backend base URL (e.g. `http://localhost:4000`)
- `VITE_AES_KEY_1` must match `server` `AES_KEY_1`

## API

### Auth

- `POST /api/auth/login`
  - body: `{ email, password }`
  - response: `{ token }`

### Students (JWT required)

- `POST /api/register`
- `GET /api/students`
- `PUT /api/student/:id`
- `DELETE /api/student/:id`

`POST/PUT` body:

```json
{ "encryptedData": { "ct": "...", "iv": "...", "s": "..." } }
```



