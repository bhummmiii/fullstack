# 🏢 Om Sai Apartment — Housing Society Hub

A full-stack Housing Society Management System built for **Om Sai Apartment** that digitalises day-to-day society operations — complaints, maintenance payments, visitor logs, notices, amenity bookings, and resident management — through a clean, role-based web application.

---

## 📑 Table of Contents

- [Live Demo & Screenshots](#live-demo--screenshots)
- [Features](#features)
- [Tech Stack & Why Each Technology](#tech-stack--why-each-technology)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Key Commands Reference](#key-commands-reference)
- [API Endpoints](#api-endpoints)
- [User Roles & Credentials](#user-roles--credentials)
- [Database Seeding](#database-seeding)

---

## ✨ Features

| Module | Admin | Resident |
|---|---|---|
| Dashboard with live charts | ✅ All flats | ✅ Own flat |
| Complaint / Issue Management | ✅ View, update, delete all | ✅ Raise & track own |
| Notices & Announcements | ✅ Create, edit, delete | ✅ View only |
| Maintenance Payments | ✅ View all, mark paid | ✅ View own history |
| Resident Directory | ✅ Full details | ✅ Contact info only |
| Visitor Management | ✅ All visitors | ✅ Own visitors |
| Amenity Booking | ✅ Approve / Reject | ✅ Book facilities |
| Documents | ✅ Upload & manage | ✅ View & download |
| Emergency Contacts | ✅ Manage | ✅ View |
| Analytics & Reports | ✅ Full | ❌ |
| Settings & Profile | ✅ | ✅ |
| Forgot Password | ✅ | ✅ |

---

## 🛠️ Tech Stack & Why Each Technology

### Backend

#### Node.js `≥ 18.0`
- **What it is:** JavaScript runtime built on Chrome's V8 engine.
- **Why used:** Allows writing server-side code in the same language as the frontend (JavaScript), reducing context-switching. Its non-blocking I/O model handles multiple simultaneous requests efficiently — ideal for a society hub that may have many residents connected at once.
- **Why not alternatives:** Python (Django/Flask) or Java (Spring) would require context switching between languages. Node.js keeps the entire codebase in one language.
- **Install:** Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)

#### Express.js `^4.18.2`
- **What it is:** Minimal, unopinionated Node.js web framework.
- **Why used:** Gives full control over routing, middleware, and request handling without the overhead of a heavy framework. Setting up REST API routes is straightforward with Express.
- **Why not alternatives:** NestJS is more structured but far heavier and complex for this scope. Fastify is faster but has a smaller ecosystem.
- **Install:** `npm install express`

#### MongoDB + Mongoose `^8.2.0`
- **What it is:** NoSQL document database with Mongoose as the ODM (Object-Document Mapper).
- **Why used:** Society data (complaints, notices, visitors) is document-like and schema-flexible. MongoDB allows storing nested objects naturally (e.g. complaint with attachments array). Mongoose adds schema validation, pre-save hooks (used for password hashing), and clean query syntax.
- **Why not alternatives:** PostgreSQL/MySQL would require rigid schema migrations every time a model changes. SQLite is not suitable for production multi-user access.
- **Install:** Use [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud, free tier) — no local install needed. Add the connection string to `.env`.

#### JSON Web Tokens — `jsonwebtoken ^9.0.2`
- **What it is:** Standard for creating access tokens that encode user identity.
- **Why used:** Stateless authentication — the server doesn't need to store sessions. Each API request carries the token in the `Authorization: Bearer <token>` header, allowing the server to verify identity without a database lookup on every request.
- **Why not alternatives:** Sessions (express-session) require server-side storage and sticky sessions in multi-server deployments. JWT is simpler and scalable.
- **Install:** `npm install jsonwebtoken`

#### bcryptjs `^2.4.3`
- **What it is:** Password hashing library.
- **Why used:** Passwords are **never** stored in plain text. bcryptjs runs a salted hash (cost factor 10) so even if the database is breached, passwords cannot be reversed.
- **Why not:** `crypto` (built-in) requires manual salt management. `argon2` is stronger but harder to install on Windows due to native dependencies. bcryptjs is pure JavaScript — zero native-build issues.
- **Install:** `npm install bcryptjs`

#### Multer `^2.1.1`
- **What it is:** Middleware for handling `multipart/form-data` (file uploads).
- **Why used:** Complaints and notices allow file attachments. Multer processes uploaded files, validates MIME types, and saves them to `server/uploads/`.
- **Install:** `npm install multer`

#### express-validator `^7.0.1`
- **What it is:** Middleware for validating and sanitising incoming request bodies.
- **Why used:** Validates required fields (email format, password length, flat number pattern) before any business logic runs, returning clean error messages to the frontend.
- **Install:** `npm install express-validator`

#### Morgan `^1.10.0`
- **What it is:** HTTP request logger middleware.
- **Why used:** Logs every incoming request (method, URL, status, response time) to the console in development — essential for debugging API calls.
- **Install:** `npm install morgan`

#### CORS `^2.8.5`
- **What it is:** Cross-Origin Resource Sharing middleware.
- **Why used:** The frontend runs on `localhost:3000` while the backend runs on `localhost:5000`. Browsers block cross-origin requests by default. CORS middleware whitelists the frontend origin.
- **Install:** `npm install cors`

#### dotenv `^16.4.5`
- **What it is:** Loads environment variables from a `.env` file into `process.env`.
- **Why used:** Keeps secrets (MongoDB URI, JWT secret, port) out of source code. The `.env` file is excluded from Git via `.gitignore`.
- **Install:** `npm install dotenv`

#### xlsx `^0.18.5`
- **What it is:** Library for reading and writing Excel files.
- **Why used:** Resident data was provided as `Residents data.xlsx`. The `seedResidentsFromExcel.js` utility reads the spreadsheet and imports all 25 residents into MongoDB automatically.
- **Install:** `npm install xlsx`

#### dayjs `^1.11.10`
- **What it is:** Lightweight date/time manipulation library (alternative to Moment.js).
- **Why used:** Used in maintenance controller for calculating due dates and overdue status. Dayjs is 2KB vs Moment.js's 67KB.
- **Install:** `npm install dayjs`

#### Nodemon `^3.1.0` *(devDependency)*
- **What it is:** Automatically restarts the Node server when source files change.
- **Why used:** Without Nodemon, you would need to manually stop and restart the server after every code change during development.
- **Install:** `npm install --save-dev nodemon`

---

### Frontend

#### React `^18.3.1`
- **What it is:** JavaScript library for building component-based user interfaces.
- **Why used:** The housing hub has many interconnected views (dashboard, complaints, residents, etc.). React's component model lets each page be an isolated, reusable unit. State management hooks (`useState`, `useEffect`, `useCallback`) handle data fetching and UI updates cleanly.
- **Why not alternatives:** Vue.js is also excellent but the team has existing React familiarity. Angular is far heavier and requires TypeScript. Plain HTML/JS would become unmanageable at this scale.
- **Install:** Bundled with Vite — `npm create vite@latest`

#### Vite `6.3.5`
- **What it is:** Next-generation frontend build tool and development server.
- **Why used:** Vite uses native ES modules for blazing-fast hot-module replacement (HMR) — changes appear in the browser in milliseconds. Production builds use Rollup for optimised bundling.
- **Why not Create React App (CRA):** CRA is deprecated and extremely slow. Webpack-based setups take 10–30s for cold starts. Vite starts in under 1 second.
- **Install:** `npm create vite@latest client -- --template react`

#### Tailwind CSS `^3.4.19`
- **What it is:** Utility-first CSS framework.
- **Why used:** Allows styling directly in JSX without writing separate CSS files for each component. The design system (colors, spacing, typography) is consistent across all pages without custom CSS conflicts.
- **Why not Bootstrap or plain CSS:** Bootstrap imposes its own visual design and requires overriding styles. Plain CSS at this scale leads to naming conflicts and bloated stylesheets.
- **Install:**
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

#### Radix UI `(multiple packages)`
- **What it is:** Unstyled, accessible UI primitives (Dialog, Dropdown, Select, Tooltip, etc.).
- **Why used:** Provides WAI-ARIA compliant, keyboard-navigable components (modals, dropdowns, alerts) without any visual opinion. Tailwind CSS is applied on top for the app's look-and-feel.
- **Why not:** Plain HTML `<dialog>` has poor cross-browser support. Material UI / Ant Design impose heavy visual styles that are hard to override.
- **Install:** `npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu` *(and others as listed in package.json)*

#### Recharts `^2.15.2`
- **What it is:** Composable charting library built on React and D3.
- **Why used:** Used in Dashboard and Analytics for bar charts (complaint trends), area charts (maintenance collection rate), line charts (visitor trends), and pie charts (category breakdown). Recharts is fully declarative — charts are written as JSX.
- **Why not Chart.js:** Chart.js uses a canvas API and requires imperative `useRef` hooks. Recharts integrates naturally with React's rendering model.
- **Install:** `npm install recharts`

#### Lucide React `^0.487.0`
- **What it is:** Beautiful, consistent icon library with 700+ icons as React components.
- **Why used:** Every button, sidebar item, status indicator, and form field uses a Lucide icon. Icons are SVG-based (scalable, crisp at any size) and tree-shakeable (only icons you import are bundled).
- **Install:** `npm install lucide-react`

#### Sonner `^2.0.3`
- **What it is:** Toast notification library for React.
- **Why used:** Shows non-intrusive success/error notifications (e.g. "Complaint submitted", "Marked as Paid") after API actions without blocking the UI.
- **Install:** `npm install sonner`

#### react-hook-form `^7.55.0`
- **What it is:** Performant, minimal form library for React.
- **Why used:** Used in the Settings and profile forms for controlled, validated form inputs with minimal re-renders.
- **Install:** `npm install react-hook-form`

---

## 📁 Folder Structure

```
full_stack/
├── .gitignore                  # Git exclusions: node_modules, .env, dist/, build/
├── README.md                   # This file — project documentation
├── Residents data.xlsx         # Source spreadsheet used to seed 25 resident accounts
│
├── client/                     # ── FRONTEND (React + Vite) ──────────────────────
│   ├── index.html              # HTML entry point — mounts <div id="root">
│   ├── vite.config.js          # Vite config: dev port 3000, @ alias → src/, SWC plugin
│   ├── tailwind.config.js      # Tailwind: content paths, no theme extensions
│   ├── postcss.config.js       # PostCSS: autoprefixer + tailwind plugins
│   ├── package.json            # Frontend dependencies & npm scripts
│   └── src/
│       ├── main.jsx            # React tree entry — renders <App /> into #root
│       ├── App.jsx             # Root component: auth state, sidebar routing, error boundary
│       ├── index.css           # Global CSS: Tailwind directives, CSS custom properties
│       │
│       ├── services/
│       │   └── api.js          # Central HTTP client: token helpers, ApiError class,
│       │                       # and named API groups (authApi, complaintsApi,
│       │                       # noticesApi, maintenanceApi, residentsApi, visitorsApi)
│       │
│       └── components/
│           ├── Login.jsx           # Login page + 3-step Forgot Password modal
│           │                       # (Verify Identity → Set Password → Success)
│           ├── Header.jsx          # Sticky top bar: live clock (updates every minute),
│           │                       # greeting, notifications dropdown, user menu
│           ├── Sidebar.jsx         # Collapsible navigation sidebar with role-based
│           │                       # menu items (admin sees more items than resident)
│           ├── Dashboard.jsx       # Role-adapted home screen with KPI cards,
│           │                       # complaint trend bar chart, maintenance area chart,
│           │                       # recent activity feed, and quick action buttons
│           ├── IssueManagement.jsx # Admin: view/update/delete all complaints with
│           │                       # debounced search (400ms), status & priority filters
│           ├── RaiseComplaint.jsx  # Resident: multi-step form to submit a new complaint
│           │                       # with file attachment support via FormData
│           ├── Announcements.jsx   # Notices board: admin creates/edits/deletes notices,
│           │                       # residents view with category filter
│           ├── ResidentDirectory.jsx # Searchable resident card grid with block filter
│           │                          # (200ms debounced client-side filter)
│           ├── MaintenancePayments.jsx # Payment records table with dynamic month
│           │                           # selector (last 12 months), admin can Mark Paid
│           ├── VisitorManagement.jsx   # Visitor log: pre-approval, entry/exit tracking
│           ├── AmenityBooking.jsx      # Book clubhouse, gym, pool, lawn; admin approves
│           ├── Documents.jsx           # File library: upload new docs, view/download
│           │                           # existing PDFs served from /documents/ endpoint
│           ├── EmergencyContacts.jsx   # Society emergency contacts with call links
│           ├── UserProfile.jsx         # Profile view/edit: name, phone, flat number,
│           │                           # change password
│           ├── Analytics.jsx           # Admin-only: 4 KPI cards, bar/area/line/pie
│           │                           # Recharts, monthly performance summary table
│           ├── Settings.jsx            # Society-wide settings management
│           │
│           ├── shared/                 # ── Reusable UI Primitives ────────────────
│           │   ├── SearchBar.jsx       # Controlled search input with focus animation,
│           │   │                       # clear button, onSearch callback
│           │   ├── StatusBadge.jsx     # Colour-coded status pill (success/warning/error)
│           │   ├── StatCard.jsx        # KPI card with icon, value, trend indicator
│           │   ├── DetailDrawer.jsx    # Slide-in side panel for record details
│           │   ├── ConfirmModal.jsx    # Generic "Are you sure?" confirmation dialog
│           │   ├── ModernTable.jsx     # Reusable table shell with header/body slots
│           │   ├── NotificationDropdown.jsx # Bell icon with unread badge & dropdown list
│           │   ├── UserMenu.jsx        # Avatar dropdown: profile link, logout button
│           │   ├── PageHeader.jsx      # Consistent page title + subtitle block
│           │   ├── EmptyState.jsx      # No-results placeholder with icon + message
│           │   └── LoadingState.jsx    # Spinner overlay for async data fetching
│           │
│           └── ui/                     # ── Radix UI / shadcn Wrappers ────────────
│               └── (button, dialog, select, sonner, etc.)
│                   # Pre-built accessible component wrappers using Radix UI
│                   # primitives styled with Tailwind utility classes
│
└── server/                     # ── BACKEND (Node.js + Express + MongoDB) ────────
    ├── server.js               # Express app entry: middleware setup, route mounting,
    │                           # static file serving (/uploads, /documents),
    │                           # health check endpoint, graceful shutdown
    ├── package.json            # Backend dependencies & npm scripts
    ├── .env                    # ⚠️ NOT committed — contains secrets (see below)
    │
    ├── config/
    │   ├── db.js               # Mongoose connection to MongoDB Atlas with retry logic
    │   └── multer.js           # Multer storage engine: saves to /uploads with UUID
    │                           # filename, validates MIME types (images/PDFs only)
    │
    ├── models/                 # ── Mongoose Schemas ──────────────────────────────
    │   ├── User.js             # User schema: name, email, password (bcrypt pre-save
    │   │                       # hook), flatNumber, role (admin/resident), phone
    │   ├── Complaint.js        # Complaint schema: title, description, category,
    │   │                       # priority, status, attachments[], residentId ref
    │   ├── Notice.js           # Notice schema: title, content, category, priority,
    │   │                       # postedBy ref, pinned flag
    │   ├── Maintenance.js      # Maintenance record: flatNumber, amount, month,
    │   │                       # dueDate, status (Paid/Unpaid/Overdue), paymentDate
    │   └── Visitor.js          # Visitor log: name, phone, purpose, flatToVisit,
    │                           # entryTime, exitTime, status, approvedBy
    │
    ├── controllers/            # ── Business Logic ────────────────────────────────
    │   ├── authController.js   # register, login (JWT issue), getProfile,
    │   │                       # updateProfile, changePassword, verifyIdentityForReset
    │   │                       # (email + flatNumber check), resetPasswordWithToken
    │   ├── complaintController.js # getComplaints (role-filtered, regex search),
    │   │                          # getComplaintById, createComplaint, updateComplaint,
    │   │                          # deleteComplaint
    │   ├── noticeController.js # getNotices (with category/priority filter),
    │   │                       # createNotice, updateNotice, deleteNotice
    │   ├── maintenanceController.js # getPayments (admin=all, resident=own),
    │   │                            # updatePayment (mark paid), generateForAllFlats
    │   ├── residentController.js    # getResidents (admin only), getResidentById,
    │   │                            # updateResident
    │   ├── visitorController.js     # getVisitors, logVisitor, approveVisitor,
    │   │                            # markExit, deleteVisitor
    │   └── adminController.js       # getDashboardStats, bulkSendNotice,
    │                                # getActivityLog
    │
    ├── routes/                 # ── Express Router Definitions ────────────────────
    │   ├── authRoutes.js       # POST /register, POST /login, GET /profile,
    │   │                       # PUT /profile, POST /forgot-password/verify,
    │   │                       # POST /forgot-password/reset
    │   ├── complaintRoutes.js  # GET /, POST /, GET /:id, PUT /:id, DELETE /:id
    │   ├── noticeRoutes.js     # GET /, POST /, PUT /:id, DELETE /:id
    │   ├── maintenanceRoutes.js # GET /, PUT /:id, POST /generate
    │   ├── residentRoutes.js   # GET /, GET /:id, PUT /:id
    │   ├── visitorRoutes.js    # GET /, POST /, PUT /:id/approve, PUT /:id/exit,
    │   │                       # DELETE /:id
    │   └── adminRoutes.js      # GET /dashboard-stats, GET /activity-log
    │
    ├── middleware/             # ── Express Middleware ────────────────────────────
    │   ├── authMiddleware.js   # protect(): verifies JWT, attaches req.user
    │   ├── roleMiddleware.js   # adminOnly(): blocks non-admin requests with 403
    │   └── errorMiddleware.js  # notFound(): 404 handler; errorHandler(): global
    │                           # error formatter (returns JSON error responses)
    │
    ├── uploads/                # Runtime folder: stores complaint/notice attachments
    │                           # (not committed — auto-created on first upload)
    ├── documents/              # Pre-generated society PDFs served at /documents/*
    │   ├── society-bylaws-2024.pdf
    │   ├── agm-minutes-2024.pdf
    │   ├── financial-report-q4-2023.pdf
    │   ├── parking-rules-circular.pdf
    │   └── committee-meeting-dec-2023.pdf
    │
    └── utils/                  # ── One-time Scripts & Helpers ────────────────────
        ├── seed.js                  # Master seed: runs all seeders in sequence
        ├── seedAdmin.js             # Creates the admin account (Jayawant Gore)
        ├── seedResidents.js         # Seeds sample resident records from JS objects
        ├── seedResidentsFromExcel.js # Reads Residents data.xlsx and upserts all
        │                            # 25 residents into MongoDB (used for initial import)
        ├── seedComplaints.js        # Seeds 8 sample complaint records
        ├── seedMaintenance.js       # Seeds maintenance payment records for all flats
        ├── seedVisitors.js          # Seeds sample visitor log entries
        ├── forceUpdatePasswords.js  # Bypasses Mongoose hooks to force-update
        │                            # raw password hashes (used to fix auth issues)
        ├── generateSampleDocs.js    # Generates the 5 sample PDF files in /documents/
        ├── generateToken.js         # CLI helper: generates a JWT for a given userId
        ├── importResidents.js       # Alternative Excel import with validation
        ├── checkResidents.js        # Prints all residents in DB for debugging
        ├── verifyResidents.js       # Verifies email format for all resident records
        ├── cleanupDuplicates.js     # Removes duplicate user records from DB
        ├── testLogin.js             # Tests login for a single email/password pair
        ├── testAllLogins.js         # Bulk-tests login for all 25 residents
        └── seedResident.js          # Seeds a single resident (for testing)
```

---

## 🔐 Environment Variables

### `server/.env` (⚠️ Never commit this file)

```env
# ── Application ──────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=5000

# ── MongoDB ───────────────────────────────────────────────────────────────────
# Get your connection string from MongoDB Atlas → Connect → Drivers
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/housing_hub?retryWrites=true&w=majority

# ── JWT ───────────────────────────────────────────────────────────────────────
# Use a long random string (min 32 characters)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=30d

# ── CORS ──────────────────────────────────────────────────────────────────────
# Comma-separated list of allowed frontend origins
CLIENT_ORIGIN=http://localhost:3000,http://localhost:5173

# ── File Upload ───────────────────────────────────────────────────────────────
MAX_FILE_SIZE=10mb
UPLOAD_PATH=./uploads
```

### `client/.env` (optional — for custom API URL)

```env
# Overrides the default http://localhost:5000/api
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Setup

### Prerequisites

| Tool | Minimum Version | Install |
|---|---|---|
| Node.js | `≥ 18.0.0` | [nodejs.org](https://nodejs.org/) |
| npm | `≥ 9.0.0` | Included with Node.js |
| Git | any | [git-scm.com](https://git-scm.com/) |
| MongoDB | Cloud (Atlas) | [mongodb.com/atlas](https://www.mongodb.com/atlas) |

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/bhummmiii/fullstack.git
cd fullstack
```

---

### Step 2 — Backend Setup

```bash
# Navigate to server folder
cd server

# Install all backend dependencies
npm install

# Create your environment file from the template above
# (create server/.env and fill in MONGODB_URI and JWT_SECRET)

# Generate the sample PDF documents (run once)
node utils/generateSampleDocs.js

# Seed the database with initial data (run once)
node utils/seedAdmin.js          # Creates admin account
node utils/seedResidentsFromExcel.js  # Imports 25 residents from Excel
node utils/seedComplaints.js     # Sample complaints
node utils/seedMaintenance.js    # Maintenance payment records
node utils/seedVisitors.js       # Sample visitor logs

# OR run everything at once with the master seeder
node utils/seed.js

# Start the backend development server (auto-restarts on changes)
npm run dev
# Server runs on → http://localhost:5000
# Health check  → http://localhost:5000/api/health
```

---

### Step 3 — Frontend Setup

```bash
# Open a new terminal and navigate to client folder
cd client

# Install all frontend dependencies
npm install

# Start the frontend development server
npm run dev
# App opens at → http://localhost:3000
```

---

### Step 4 — Access the App

Open **http://localhost:3000** in your browser. Use the quick-login buttons on the login screen or the credentials below.

---

## 🔑 Key Commands Reference

### Backend

```bash
# Install dependencies
cd server && npm install

# Development server (with auto-restart)
npm run dev

# Production server
npm start

# Run the master database seeder
npm run seed

# Individual utility scripts
node utils/seedAdmin.js                 # Seed admin user
node utils/seedResidentsFromExcel.js    # Import residents from Excel file
node utils/seedComplaints.js            # Seed sample complaints
node utils/seedMaintenance.js           # Seed maintenance records
node utils/seedVisitors.js              # Seed visitor logs
node utils/generateSampleDocs.js        # Generate sample PDF documents
node utils/testAllLogins.js             # Verify all 25 resident logins work
node utils/cleanupDuplicates.js         # Remove duplicate DB records
```

### Frontend

```bash
# Install dependencies
cd client && npm install

# Development server (HMR enabled, opens browser automatically)
npm run dev

# Production build (outputs to client/build/)
npm run build
```

### Git

```bash
# Initial setup (already done — for reference)
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/bhummmiii/fullstack.git
git push -u origin main

# Subsequent pushes
git add .
git commit -m "your message"
git push
```

### Tailwind CSS Setup (reference — already configured)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>` header.

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new user |
| `POST` | `/login` | Public | Login, returns JWT token |
| `GET` | `/profile` | Protected | Get current user profile |
| `PUT` | `/profile` | Protected | Update profile |
| `PUT` | `/change-password` | Protected | Change password |
| `POST` | `/forgot-password/verify` | Public | Verify identity (email + flat no.) |
| `POST` | `/forgot-password/reset` | Public | Reset password with token |

### Complaints — `/api/complaints`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Protected | Admin: all; Resident: own. Supports `?search=&status=&priority=` |
| `POST` | `/` | Protected | Create complaint (supports file upload) |
| `GET` | `/:id` | Protected | Get single complaint |
| `PUT` | `/:id` | Protected | Update complaint |
| `DELETE` | `/:id` | Admin | Delete complaint |

### Notices — `/api/notices`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Protected | Get all notices. Supports `?category=&priority=` |
| `POST` | `/` | Admin | Create notice |
| `PUT` | `/:id` | Admin | Update notice |
| `DELETE` | `/:id` | Admin | Delete notice |

### Maintenance — `/api/maintenance`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Protected | Admin: all records; Resident: own flat |
| `PUT` | `/:id` | Admin | Update payment (mark paid, update status) |
| `POST` | `/generate` | Admin | Generate monthly records for all flats |

### Residents — `/api/residents`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Admin | Get all residents |
| `GET` | `/:id` | Admin | Get single resident |
| `PUT` | `/:id` | Admin | Update resident details |

### Visitors — `/api/visitors`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Protected | Get visitor log |
| `POST` | `/` | Protected | Log new visitor |
| `PUT` | `/:id/approve` | Admin | Approve visitor entry |
| `PUT` | `/:id/exit` | Protected | Mark visitor exit |
| `DELETE` | `/:id` | Admin | Delete visitor record |

### Admin — `/api/admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/dashboard-stats` | Admin | Aggregate stats for dashboard |
| `GET` | `/activity-log` | Admin | Recent activity across all modules |

### Static Files

| Path | Description |
|---|---|
| `GET /uploads/:filename` | Serve uploaded attachments (images, PDFs) |
| `GET /documents/:filename` | Serve society documents (bylaws, reports, circulars) |
| `GET /api/health` | Health check — returns server status and timestamp |

---

## 👤 User Roles & Credentials

### Admin Account

| Field | Value |
|---|---|
| Email | `admin@omsaiapt.com` |
| Password | `Admin@123` |
| Role | Admin |
| Flat | `ADMIN-001` |

### Sample Resident Accounts

All 25 residents were imported from `Residents data.xlsx`. A few examples:

| Name | Email | Flat | Password |
|---|---|---|---|
| Rohan Deshmukh | `rohan.deshmukh@gmail.com` | A-101 | `Rohan@123` |
| Priya Sharma | `priya.sharma@gmail.com` | A-102 | `Priya@123` |
| Amit Patel | `amit.patel@gmail.com` | B-201 | `Amit@123` |
| Sunita Kulkarni | `sunita.kulkarni@gmail.com` | B-202 | `Sunita@123` |

> All 25 resident passwords follow the pattern: `FirstName@123`

### Forgot Password Flow

1. Click **"Forgot Password?"** on the login screen.
2. Enter your **registered email** and **flat number**.
3. If verified, enter your new password.
4. Login with the new password immediately.

---

## 🌱 Database Seeding

The `server/utils/` folder contains scripts for populating the database:

```bash
# Recommended order for a fresh setup:
node utils/seedAdmin.js                # 1. Admin account
node utils/seedResidentsFromExcel.js   # 2. All 25 residents (reads Residents data.xlsx)
node utils/seedComplaints.js           # 3. Sample complaints
node utils/seedMaintenance.js          # 4. Maintenance payment records
node utils/seedVisitors.js             # 5. Visitor logs
node utils/generateSampleDocs.js       # 6. PDF documents for the Documents section

# Verify everything seeded correctly
node utils/checkResidents.js           # List all residents in DB
node utils/testAllLogins.js            # Test all 25 resident logins
```

> **Note:** The `seedResidentsFromExcel.js` script uses an **upsert** strategy (match by `flatNumber` or `email`), so it is safe to run multiple times without creating duplicates.

---

## 📊 Data Flow Architecture

```
Browser (React)
    │
    │  HTTP + JWT Bearer Token
    ▼
Express Server (port 5000)
    │
    ├── authMiddleware.js  (verify JWT)
    ├── roleMiddleware.js  (admin guard)
    │
    ├── /api/complaints  → complaintController.js
    ├── /api/notices     → noticeController.js
    ├── /api/maintenance → maintenanceController.js
    ├── /api/residents   → residentController.js
    ├── /api/visitors    → visitorController.js
    └── /api/admin       → adminController.js
            │
            ▼
      Mongoose ODM
            │
            ▼
      MongoDB Atlas (Cloud)
```

---

## 📄 License

MIT — feel free to use and modify for educational or personal projects.

---

*Built with ❤️ for Om Sai Apartment, Pune.*
