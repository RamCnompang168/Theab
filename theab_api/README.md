# Somboth Wedding & Event Management API

A robust, lightweight RESTful backend API built with **Express 5**, **JSON Web Tokens (JWT)**, and **bcryptjs** password hashing, featuring a persistent local JSON database.

---

## 🚀 Quick Start

### 1. Installation & Start
```bash
# Navigate to API directory
cd c:\Users\ASUS\Documents\Theab\theab_api

# Install dependencies (already installed)
npm install

# Start the server (runs on port 5000)
npm start
# or
node index.js
```

### 2. Live URLs
- **Base URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`
- **Frontend Allowed Origin**: `http://localhost:3000`

---

## 🔑 Authentication

All authenticated requests must include the JWT token in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

### Pre-seeded Demo Account
- **Email**: `korng.korng@somboth.com`
- **Password**: `password123`
- **Role**: `Couple / Organizer`

---

## 📚 API Endpoints Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account (`name`, `email`, `password`, `role`) | No |
| `POST` | `/api/auth/login` | Login with credentials (`email`, `password`) | No |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user | Yes |
| `PUT` | `/api/auth/profile` | Update profile (`name`, `role`, `avatar`) | Yes |

### 2. Wedding Projects (`/api/projects`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/projects` | List all projects belonging to user | Yes |
| `GET` | `/api/projects/:id` | Get single wedding project details | Optional |
| `GET` | `/api/projects/:id/dashboard` | Aggregated dashboard stats (Guests, Budget, Gifts) | Optional |
| `POST` | `/api/projects` | Create wedding project (auto-initializes template) | Yes |
| `PUT` | `/api/projects/:id` | Update project details (venue, budget, exchange rate) | Yes |
| `DELETE` | `/api/projects/:id` | Delete project and cascade-remove all child records | Yes |

### 3. Guest Management & RSVPs (`/api/guests`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/guests?projectId=...` | List guests (filterable by `status`, `group`, `search`) | Optional |
| `GET` | `/api/guests/stats?projectId=...` | RSVP summary counts and attendance rate | Optional |
| `GET` | `/api/guests/:id` | Get single guest record | Optional |
| `POST` | `/api/guests` | Add new guest to directory | Yes |
| `PUT` | `/api/guests/:id` | Update guest details (table, notes, wishes) | Yes |
| `PATCH` | `/api/guests/:id/status` | Quick toggle status (`Confirmed`, `Pending`, `Declined`) | Yes |
| `DELETE` | `/api/guests/:id` | Delete guest from list | Yes |
| `POST` | `/api/guests/rsvp` | Public guest RSVP submission from digital invite | No (Public) |

### 4. Expense & Budget Tracking (`/api/expenses`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/expenses?projectId=...` | List expenses (filterable by `category`, `status`) | Optional |
| `GET` | `/api/expenses/summary?projectId=...` | Budget vs. Actual spend, category breakdown | Optional |
| `GET` | `/api/expenses/:id` | Get single expense item | Optional |
| `POST` | `/api/expenses` | Add new expense item | Yes |
| `PUT` | `/api/expenses/:id` | Update expense item | Yes |
| `DELETE` | `/api/expenses/:id` | Delete expense item | Yes |

### 5. Wedding Gift Envelopes (`/api/gifts`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/gifts?projectId=...` | List gift envelopes (USD & KHR) | Optional |
| `GET` | `/api/gifts/summary?projectId=...` | Gift analytics (USD, KHR, total USD equivalent) | Optional |
| `GET` | `/api/gifts/export?projectId=...` | Download CSV spreadsheet of all envelopes | Optional |
| `GET` | `/api/gifts/:id` | Get single gift envelope | Optional |
| `POST` | `/api/gifts` | Record incoming gift envelope | Yes |
| `PATCH` | `/api/gifts/:id/thank-you` | Toggle thank-you card sent/pending status | Yes |
| `PUT` | `/api/gifts/:id` | Update gift envelope details | Yes |
| `DELETE` | `/api/gifts/:id` | Delete gift envelope | Yes |

### 6. Digital Invitation Template (`/api/template`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/template/:projectId` | Fetch full invitation customization settings | Optional |
| `PUT` | `/api/template/:projectId` | Save invitation design, schedule, KHQR & colors | Yes |
| `GET` | `/api/template/public/:projectId`| Public invitation preview for wedding guests | No (Public) |

---

## 💾 Database Architecture

Data is stored persistently in `data/db.json`:
- `users`: Registered users with hashed passwords.
- `projects`: Wedding events and budgets.
- `guests`: Guest lists, table numbers, and RSVP statuses.
- `expenses`: Budgets, actual payments, vendor categories.
- `gifts`: Cash envelopes in USD & KHR with thank-you tracking.
- `templates`: Full visual styling and schedule for the digital invite.
