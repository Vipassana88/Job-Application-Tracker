# Job Application Tracker (Full Stack)

A full-stack app to track job applications with authentication, CRUD, filters, pagination, and dashboard stats.

## Tech Stack
- Frontend: React (Vite), React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT

## Features
- Register/Login (JWT)
- Add/Edit/Delete job applications
- Filter by status + search by company/role/location
- Pagination
- Dashboard summary counts

## Run Locally

### 1) Backend
```bash
cd server
npm install
cp .env.example .env
# edit .env and set MONGO_URI + JWT_SECRET
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open: http://localhost:5173
