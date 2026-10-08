# ParcelPath — Courier and Parcel Tracking System

Production-oriented MERN application for public shipment tracking and role-based parcel operations.

## Features

- JWT authentication with customer, driver, courier staff, and administrator roles.
- Public tracking lookup with complete timestamped status history.
- Customer dashboard scoped to their parcels.
- Staff/admin operations screen with filtering, shipment registration, driver assignment, and status update notes.
- A driver portal for assigned deliveries, including truck state, current location, and delivery-progress updates.
- Mongoose schemas, bcrypt password hashing, Zod input validation, pagination, CORS, Helmet, and centralized API errors.

## Project layout

```
backend/     Express + MongoDB API
frontend/    Vite + React + Tailwind client
```

## Run locally

1. Install Node.js 20+ and start MongoDB locally (or provision a MongoDB Atlas database).
2. Copy `backend/.env.example` to `backend/.env`, then set `MONGODB_URI` and a strong `JWT_SECRET`.
3. Copy `frontend/.env.example` to `frontend/.env`. Change `VITE_API_URL` only if the API is hosted elsewhere.
4. From the repository root, install dependencies and start both apps:

```bash
npm install
npm run dev
```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Roles and first users

Public registration supports **customer**, **driver**, and **admin** accounts for local development. Driver accounts provide a vehicle number during registration. For a production deployment, restrict administrator provisioning to trusted staff.

```js
db.users.updateOne({ email: 'ops@example.com' }, { $set: { role: 'courier_staff' } })
```

Staff/admin users can select a registered customer and optionally assign a driver while creating shipments. Customers only see their own shipments; drivers only see shipments assigned to them. Admins and staff can list all shipments. Each driver update records delivery status, truck status, location, and a note in the visible parcel history.

## API summary

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/parcels/track/:trackingNumber` | Public |
| GET | `/api/parcels` | Authenticated (customer-scoped for customers) |
| POST | `/api/parcels` | Staff/Admin |
| PATCH | `/api/parcels/:id/status` | Assigned Driver / Staff / Admin |
| DELETE | `/api/parcels/:id` | Owner cancel or Staff/Admin |

Use `Authorization: Bearer <token>` for authenticated endpoints.
