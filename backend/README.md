# KhmerCharm Accessories — Backend API

> ⚠️ **EDUCATIONAL / LOCALHOST DEMO ONLY**
> This backend contains **intentional security vulnerabilities** for a
> Network Design / Cybersecurity Architecture school demonstration.
> **Do NOT deploy to a public server.**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Installation](#2-installation)
3. [Running the Server](#3-running-the-server)
4. [Sample Credentials](#4-sample-credentials)
5. [API Route Reference](#5-api-route-reference)
6. [Vulnerable Endpoints](#6-vulnerable-endpoints-demo-table)
7. [Secure Endpoints](#7-secure-endpoints-table)
8. [Attack Demo Script](#8-attack-demo-script)
9. [Protection Plan](#9-protection-plan)
10. [Network Architecture](#10-network-architecture-diagram)
11. [Testing with Postman / Thunder Client](#11-testing-with-postman--thunder-client)
12. [Connecting to React Frontend](#12-connecting-to-react-frontend)

---

## 1. Project Overview

**KhmerCharm Accessories** is a Cambodian-inspired e-commerce store selling
handmade accessories: bracelets, necklaces, rings, hair clips, bags, phone charms,
earrings, and keychains.

This backend is intentionally built in **two layers**:

| Layer | Purpose |
|---|---|
| Vulnerable version | Demonstrates real-world attack vectors in a safe local lab |
| Secure version | Shows how each vulnerability is fixed |

**Tech Stack:**

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** SQLite (via `better-sqlite3`)
- **Auth:** JSON Web Tokens (JWT)
- **Password hashing:** bcryptjs
- **File uploads:** Multer
- **CORS:** Enabled for React frontend

---

## 2. Installation

```bash
# Navigate to the backend folder
cd Network-Design-Project/backend

# Install all dependencies
npm install

# Copy environment file
cp .env.example .env

# Seed the database with sample data
npm run seed
```

---

## 3. Running the Server

```bash
# Production mode
npm start

# Development mode with auto-restart (nodemon)
npm run dev
```

Server starts on: **http://localhost:5000**
Health check:     **http://localhost:5000/api/health**

---

## 4. Sample Credentials

> ⚠️ These passwords are stored as PLAIN TEXT in the demo seed.
> This is intentional for the vulnerability demonstration.

| Role     | Email                        | Password     |
|----------|------------------------------|--------------|
| Admin    | admin@khmercharm.com         | admin123     |
| Customer | customer@khmercharm.com      | customer123  |

---

## 5. API Route Reference

### Auth  `/api/auth`

| Method | Route             | Auth | Description           |
|--------|-------------------|------|-----------------------|
| POST   | /register         | ❌   | Register new account  |
| POST   | /login            | ❌   | Login, returns token  |
| GET    | /me               | ✅   | Get current user      |

### Products  `/api/products`

| Method | Route                        | Auth        | Description                      |
|--------|------------------------------|-------------|----------------------------------|
| GET    | /                            | ❌          | All products (supports filters)  |
| GET    | /:id                         | ❌          | Single product                   |
| GET    | /vulnerable-search?keyword=  | ❌ ⚠️       | SQL injection demo               |
| GET    | /secure-search?keyword=      | ❌ ✅       | Parameterized query demo         |
| GET    | /:id/reviews                 | ❌          | Product reviews                  |
| POST   | /:id/reviews                 | Customer    | Add a review                     |
| POST   | /                            | Admin       | Create product                   |
| PUT    | /:id                         | Admin       | Update product                   |
| DELETE | /:id                         | Admin       | Delete product                   |

**Product filters** (query params):
```
?category=Bracelets
?search=lotus
?tag=New
?minPrice=5&maxPrice=20
```

### Cart  `/api/cart`

| Method | Route | Auth     | Description         |
|--------|-------|----------|---------------------|
| GET    | /     | Customer | Get cart            |
| POST   | /     | Customer | Add item to cart    |
| PUT    | /:id  | Customer | Update quantity     |
| DELETE | /:id  | Customer | Remove item         |
| DELETE | /     | Customer | Clear entire cart   |

### Orders  `/api/orders`

| Method | Route | Auth     | Description             |
|--------|-------|----------|-------------------------|
| POST   | /     | Customer | Create order from cart  |
| GET    | /     | Customer | My orders               |
| GET    | /:id  | Customer | Single order            |

### Users  `/api/users`

| Method | Route            | Auth     | Description        |
|--------|------------------|----------|--------------------|
| GET    | /profile         | Customer | Get profile        |
| PUT    | /profile         | Customer | Update profile     |
| PUT    | /change-password | Customer | Change password    |

### Admin  `/api/admin`

| Method | Route               | Auth       | Description              |
|--------|---------------------|------------|--------------------------|
| GET    | /demo-users         | ❌ ⚠️      | BAC vulnerability demo   |
| GET    | /secure-users       | Admin ✅   | Protected user list      |
| GET    | /users              | Admin      | All users (no passwords) |
| GET    | /orders             | Admin      | All orders               |
| PUT    | /orders/:id/status  | Admin      | Update order status      |
| GET    | /dashboard          | Admin      | Stats dashboard          |

### Upload  `/api/upload`

| Method | Route   | Auth       | Description             |
|--------|---------|------------|-------------------------|
| POST   | /demo   | ❌ ⚠️      | Insecure upload demo    |
| POST   | /secure | Admin ✅   | Safe upload (img only)  |

---

## 6. Vulnerable Endpoints (Demo Table)

| # | Endpoint | Vulnerability | Attack Example |
|---|----------|---------------|----------------|
| 1 | `POST /api/auth/login` | Weak plain-text passwords in DB | Open DB file, read passwords directly |
| 2 | `GET /api/products/vulnerable-search?keyword=` | SQL Injection | `?keyword=' OR '1'='1' --` |
| 3 | `GET /api/products/vulnerable-search?keyword=` | SQL Injection (UNION) | `?keyword=' UNION SELECT id,name,email,password,role,price_usd,price_khr,image_url,stock,tag,rating,created_at FROM users --` |
| 4 | `GET /api/admin/demo-users` | Broken Access Control | Call with no token — returns all users + passwords |
| 5 | `POST /api/upload/demo` | Insecure file upload | Upload a `.php` or `.sh` file — no validation |
| 6 | JWT secret | Weak JWT secret (`demo_secret_change_me`) | Forge a token with known secret |

---

## 7. Secure Endpoints (Table)

| # | Endpoint | Protection Applied |
|---|----------|--------------------|
| 1 | `POST /api/auth/register` | bcrypt hash (cost 12) |
| 2 | `GET /api/products/secure-search?keyword=` | Parameterized query — injection impossible |
| 3 | `GET /api/admin/secure-users` | `protect` (JWT) + `requireRole('admin')` |
| 4 | `POST /api/upload/secure` | Auth required, whitelist MIME+ext, 2MB limit, UUID filename |
| 5 | All cart/order routes | `protect` middleware — valid JWT required |
| 6 | All admin routes | `protect` + `requireRole('admin')` |

---

## 8. Attack Demo Script

Follow this order for your class presentation:

### Step 1 — Start the server
```bash
npm run seed   # seed DB with sample data
npm start      # start backend
```

### Step 2 — Normal ecommerce flow
```
GET  http://localhost:5000/api/health
GET  http://localhost:5000/api/products
POST http://localhost:5000/api/auth/login
     body: { "email": "customer@khmercharm.com", "password": "customer123" }
```

### Step 3 — Demo weak password storage
```bash
# Open the database file directly
# Tool: DB Browser for SQLite (free)
# File: backend/database/khmercharm.db
# Table: users
# Show: passwords stored as plain text "admin123", "customer123"
```

### Step 4 — SQL Injection Attack
```
# Normal search (works fine)
GET http://localhost:5000/api/products/vulnerable-search?keyword=bracelet

# SQL Injection — dump ALL products
GET http://localhost:5000/api/products/vulnerable-search?keyword=' OR '1'='1

# SQL Injection — UNION attack to steal user table (including passwords)
GET http://localhost:5000/api/products/vulnerable-search?keyword=' UNION SELECT id,name,email,password,role,price_usd,price_khr,image_url,stock,tag,rating,created_at FROM users --

# Secure version (injection attempt returns empty/literal match)
GET http://localhost:5000/api/products/secure-search?keyword=' OR '1'='1
```

### Step 5 — Broken Access Control
```
# Call admin endpoint with NO token — should be blocked but isn't (vulnerable)
GET http://localhost:5000/api/admin/demo-users
→ Returns all users + plain text passwords!

# Secure version — requires valid admin JWT
GET http://localhost:5000/api/admin/secure-users
→ 401 Unauthorized (without token)
```

### Step 6 — Insecure File Upload
```
# Upload a "shell" file (rename any .txt to .php for demo)
POST http://localhost:5000/api/upload/demo
     form-data: file = shell.php
→ File accepted! Now accessible at /uploads/shell.php

# Secure version rejects it
POST http://localhost:5000/api/upload/secure
     form-data: file = shell.php
→ 500 / error: Invalid file type
```

### Step 7 — Show the fixes (secure endpoints)
- Walk through `secureSearch` in productController.js — parameterized query
- Walk through `secureUsers` in adminController.js — protect + requireRole
- Walk through `multerSecure` in uploadController.js — whitelist + UUID

### Step 8 — Network architecture explanation
- Show how a Firewall would block external access to port 5000
- Show how HTTPS/TLS encrypts data in transit
- Show how an IDS/IPS would detect the UNION SELECT attack pattern

---

## 9. Protection Plan

| Threat | Vulnerable Demo | Secure Fix |
|--------|----------------|------------|
| Weak passwords | Plain text in DB | bcrypt with cost ≥ 12 |
| SQL Injection | String concatenation | Parameterized queries (?) |
| Broken Access Control | No auth on admin routes | JWT protect + requireRole |
| Insecure Upload | No type/size check | Whitelist MIME+ext, UUID name, 2MB limit |
| Weak JWT | Short secret + 7d expiry | 64-char random secret + 15m expiry + refresh token |
| Token theft | Bearer in header | HttpOnly Secure SameSite=Strict cookie |
| Information disclosure | Stack traces in errors | Generic messages in production |
| CORS | Dev-open | Lock to specific trusted origin |
| No HTTPS | HTTP plaintext | TLS certificate (Let's Encrypt / nginx proxy) |
| No rate limiting | Unlimited requests | express-rate-limit on auth routes |
| No logging/monitoring | console.log only | Winston → SIEM → IDS alerts |

---

## 10. Network Architecture Diagram

```
                        INTERNET
                           │
                    ┌──────▼──────┐
                    │   FIREWALL   │  ← Block all except 80/443
                    │  (iptables/  │    Block direct DB access
                    │   pfSense)   │    Block port 5000 externally
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
       ┌──────▼──────┐         ┌────────▼────────┐
       │  React App   │         │   NGINX / Proxy  │
       │  :5173/80    │         │   HTTPS + TLS    │
       │  (Frontend)  │         │   Rate Limiting  │
       └──────┬──────┘         └────────┬────────┘
              │  CORS (trusted origin)  │
              └────────────┬────────────┘
                           │
                    ┌──────▼──────┐
                    │  Express    │  ← JWT auth on every route
                    │  Backend    │    Input validation
                    │  :5000      │    Helmet.js headers
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   SQLite    │  ← Parameterized queries only
                    │  Database   │    File not web-accessible
                    └─────────────┘

        ┌─────────────────────────────────┐
        │  SECURITY MONITORING LAYER       │
        │  - IDS/IPS (Snort / Suricata)    │
        │  - Log aggregation (ELK Stack)   │
        │  - Alerting (failed logins,      │
        │    SQL injection patterns)       │
        └─────────────────────────────────┘

        ┌─────────────────────────────────┐
        │  ADMIN ACCESS                    │
        │  - VPN required for admin panel  │
        │  - 2FA on admin accounts         │
        │  - Separate admin network VLAN   │
        └─────────────────────────────────┘

        ┌─────────────────────────────────┐
        │  BACKUP SYSTEM                   │
        │  - Daily automated DB backup     │
        │  - Encrypted off-site storage    │
        │  - Recovery procedure tested     │
        └─────────────────────────────────┘
```

### Component Descriptions

| Component | Role in Architecture |
|-----------|---------------------|
| React Frontend | User-facing SPA; communicates only with Backend API over HTTPS |
| NGINX Proxy | Terminates TLS, rate-limits requests, serves static files |
| Express Backend | Business logic, authentication, data validation |
| SQLite Database | Stores all data; only accessible by backend process |
| Firewall | Blocks unauthorized ports; only 80/443 open externally |
| IDS/IPS | Detects attack patterns (SQL injection, brute-force) |
| VPN | Required for admin to access the admin panel |
| Logging | All requests logged; anomalies trigger alerts |
| Backup | Automated daily backup with encryption |

---

## 11. Testing with Postman / Thunder Client

### Import Collection Steps
1. Open Postman or Thunder Client (VS Code extension)
2. Create a new collection called **KhmerCharm API**
3. Set base URL variable: `{{base}} = http://localhost:5000`

### Quick test sequence:

```
# 1. Health check
GET {{base}}/api/health

# 2. Get all products
GET {{base}}/api/products

# 3. Login as admin
POST {{base}}/api/auth/login
Content-Type: application/json
{
  "email": "admin@khmercharm.com",
  "password": "admin123"
}
→ Copy the token from response

# 4. Use token for protected routes
GET {{base}}/api/admin/users
Authorization: Bearer <paste_token_here>

# 5. Test SQL injection
GET {{base}}/api/products/vulnerable-search?keyword=' OR '1'='1

# 6. Test broken access control
GET {{base}}/api/admin/demo-users
(no Authorization header)

# 7. Filter products
GET {{base}}/api/products?category=Bracelets
GET {{base}}/api/products?tag=Sale
GET {{base}}/api/products?minPrice=5&maxPrice=15
```

---

## 12. Connecting to React Frontend

In your React app, set the API base URL to:

```js
// khmercharm/src/api/config.js
export const API_BASE = "http://localhost:5000/api";
```

### Login example (React):
```js
const response = await fetch(`${API_BASE}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const data = await response.json();
// Store data.data.token in localStorage or React context
localStorage.setItem("token", data.data.token);
```

### Authenticated request example:
```js
const token = localStorage.getItem("token");
const response = await fetch(`${API_BASE}/products`, {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

---

> ⚠️ **Final Reminder:** This project is built for a **controlled local lab environment**
> as part of a school Network Design / Cybersecurity Architecture course.
> The intentional vulnerabilities must NEVER be exposed on a public network.
> Always run on `localhost` or an isolated private VM.
>
> **Made with ❤️ for KhmerCharm Accessories 🇰🇭**
