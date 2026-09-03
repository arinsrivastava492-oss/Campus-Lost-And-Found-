# Campus Lost & Found System

A full-stack web app where students can report items they've **lost** or
**found** on campus, browse/search other posts, and mark items as
resolved once they're reunited with their owner.

Built with: **React** (frontend) + **Node.js / Express** (backend) +
**MongoDB** (database) + **JWT** (authentication).

This README explains not just *how to run it*, but *how it works*, so
you can understand, extend, and explain every part of it (e.g. in an
interview or viva).

---

## 1. How the pieces fit together

```
 ┌─────────────┐        HTTP requests        ┌──────────────┐        Mongoose queries      ┌───────────┐
 │   React     │  ───────────────────────▶   │   Express    │  ──────────────────────────▶ │  MongoDB  │
 │  (frontend) │  ◀───────────────────────   │  (backend)   │  ◀────────────────────────── │ (database)│
 └─────────────┘        JSON responses        └──────────────┘         documents            └───────────┘
   port 5173                                     port 5000
```

- **Frontend (React + Vite)** — everything the user sees and clicks.
  It never talks to MongoDB directly; it only calls the backend's API
  using `axios`.
- **Backend (Express)** — a REST API. It receives requests like
  `POST /api/items`, checks permissions, talks to MongoDB, and sends
  back JSON.
- **Database (MongoDB)** — stores two collections: `users` and `items`.
- **JWT (JSON Web Tokens)** — after login, the backend gives the
  frontend a signed token. The frontend attaches that token to every
  request that needs to know "who is logged in" (like posting an item).
  The backend verifies the token instead of trusting the request blindly.

---

## 2. Folder structure

```
campus-lost-found/
├── backend/
│   ├── config/db.js            → connects to MongoDB
│   ├── models/                 → defines the shape of User & Item data
│   │   ├── User.js
│   │   └── Item.js
│   ├── middleware/auth.js      → checks the JWT token on protected routes
│   ├── controllers/            → the actual logic for each API endpoint
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── routes/                 → maps URLs to controller functions
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   ├── server.js               → starts everything
│   ├── .env.example            → template for secret config values
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/axios.js            → one shared HTTP client, auto-attaches JWT
    │   ├── context/AuthContext.jsx → app-wide "who is logged in" state
    │   ├── components/             → reusable UI pieces (Navbar, ItemCard…)
    │   ├── pages/                  → one file per screen (Home, Login, …)
    │   ├── styles/index.css        → all styling
    │   ├── App.jsx                 → defines the routes/URLs
    │   └── main.jsx                → app entry point
    ├── index.html
    └── package.json
```

**Why this structure (MVC-ish pattern)?**
- `models/` = what the data looks like
- `controllers/` = what happens (business logic)
- `routes/` = which URL triggers which controller
- `middleware/` = checks that run *before* a controller (like "is this
  user logged in?")

This separation means you can change how a request is *routed* without
touching the *logic*, and vice versa — a common structure in real
production backends.

---

## 3. Setting it up on your machine

### Prerequisites
- [Node.js](https://nodejs.org) v18+ installed
- A MongoDB database — either:
  - MongoDB installed locally, **or**
  - A free cloud database from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (easier if you don't want to install MongoDB)

### Step 1 — Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` → your MongoDB connection string
- `JWT_SECRET` → any long random string (this signs your login tokens)

Then start the server:

```bash
npm run dev      # auto-restarts on file changes (uses nodemon)
# or
npm start        # plain node
```

You should see:
```
✅ MongoDB connected: ...
🚀 Server running on http://localhost:5000
```

Visit `http://localhost:5000` in a browser — you should see a small
"API is running" message. That confirms the backend works.

### Step 2 — Frontend setup

Open a **second terminal** (keep the backend running in the first):

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` — the app should load.

> The frontend is hardcoded to call the backend at
> `http://localhost:5000/api` (see `frontend/src/api/axios.js`). If you
> deploy the backend somewhere else, update that URL.

---

## 4. Walking through how a request flows (example: posting an item)

1. User fills out the "Report an item" form and clicks **Post item**.
2. `ReportItem.jsx` calls `api.post("/items", form)`.
3. `api/axios.js`'s request interceptor automatically attaches the
   saved JWT token as an `Authorization: Bearer <token>` header.
4. The request hits the backend at `POST /api/items`
   (`routes/itemRoutes.js`).
5. The `protect` middleware (`middleware/auth.js`) runs first — it
   verifies the token, looks up the user in MongoDB, and attaches them
   to `req.user`. If the token is missing/invalid, the request is
   rejected here with a 401 error and the controller never runs.
6. `controllers/itemController.js`'s `createItem` function runs: it
   validates the fields and saves a new `Item` document to MongoDB,
   tagging it with `postedBy: req.user._id`.
7. The new item is sent back as JSON, and the frontend redirects the
   user to that item's details page.

The same pattern (frontend → axios → route → middleware → controller
→ MongoDB → JSON response) applies to every feature in the app.

---

## 5. API reference

| Method | Route              | Auth required? | Purpose                          |
|--------|--------------------|-----------------|-----------------------------------|
| POST   | `/api/auth/register`| No             | Create an account                |
| POST   | `/api/auth/login`   | No             | Log in, get a token              |
| GET    | `/api/auth/me`      | Yes            | Get your own profile             |
| GET    | `/api/items`        | No             | List/search items (`?search=`, `?status=`, `?category=`) |
| GET    | `/api/items/mine`   | Yes            | List items *you* posted          |
| GET    | `/api/items/:id`    | No             | Get one item's details           |
| POST   | `/api/items`        | Yes            | Create a new item post           |
| PUT    | `/api/items/:id`    | Yes (owner only)| Edit an item / mark resolved    |
| DELETE | `/api/items/:id`    | Yes (owner only)| Delete an item                  |

---

## 6. Features implemented

- User registration & login with hashed passwords (`bcryptjs`) and
  JWT-based sessions
- Post a "lost" or "found" item with category, location, date, and
  optional photo URL
- Browse all items, with live search and filter by status/category
- View full item details, including who posted it
- Owners can mark their own posts as resolved, or delete them
- "My posts" page to track everything you've reported
- Route protection: both on the frontend (can't reach `/report`
  without logging in) and the backend (API rejects unauthenticated
  requests) — this matters, since frontend checks alone can be bypassed

## 7. Ideas to extend it further

- Image upload (instead of pasting an image URL) using a service like
  Cloudinary
- Email or push notifications when someone reports a match
  for your lost item
- Comments/messaging between the finder and the owner
- An admin view to moderate posts
- Pagination for the items list once there are many posts
