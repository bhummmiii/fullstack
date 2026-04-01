# Om Sai Apartment — Society Management System

A full-stack housing society management application with a React frontend and a Node.js + Express + MongoDB backend.

---

## Folder Structure

```
design_society_management/
├── client/                        ← Frontend (React + TypeScript + Vite)
│   ├── .env                       ← Environment variable: VITE_API_URL
│   ├── index.html                 ← HTML entry point for Vite
│   ├── vite.config.ts             ← Vite build config with path aliases (@/)
│   ├── tsconfig.json              ← Root TypeScript config (references app + node)
│   ├── tsconfig.app.json          ← TS config for src/ (React app code)
│   ├── tsconfig.node.json         ← TS config for vite.config.ts
│   ├── package.json               ← Frontend dependencies and scripts
│   └── src/
│       ├── main.tsx               ← React app bootstrap (renders <App />)
│       ├── App.tsx                ← Root component: auth state, routing, layout
│       ├── index.css              ← Global base CSS
│       ├── vite-env.d.ts          ← Vite environment type declarations
│       │
│       ├── components/            ← All UI page components
│       │   ├── Login.tsx          ← Login page with email/password form
│       │   ├── Dashboard.tsx      ← Admin/resident home with summary stats
│       │   ├── Sidebar.tsx        ← Left navigation sidebar
│       │   ├── Header.tsx         ← Top bar with notifications and user menu
│       │   ├── Announcements.tsx  ← Create and view society announcements
│       │   ├── IssueManagement.tsx← Admin view: manage all complaints
│       │   ├── RaiseComplaint.tsx ← Resident view: submit a new complaint
│       │   ├── MaintenancePayments.tsx ← Maintenance fee records and status
│       │   ├── VisitorManagement.tsx   ← Log and track visitor entries
│       │   ├── ResidentDirectory.tsx   ← All 25 residents, block-wise filter
│       │   ├── AmenityBooking.tsx ← Book society amenities (clubhouse etc.)
│       │   ├── Documents.tsx      ← Upload and view society documents
│       │   ├── EmergencyContacts.tsx   ← Emergency numbers and staff contacts
│       │   ├── Analytics.tsx      ← Charts and statistics for admin
│       │   ├── UserProfile.tsx    ← Resident profile page
│       │   ├── Settings.tsx       ← Society settings (name, admin, payments)
│       │   │
│       │   ├── shared/            ← Reusable UI building blocks
│       │   │   ├── ConfirmModal.tsx     ← Generic confirmation dialog
│       │   │   ├── DetailDrawer.tsx     ← Slide-in detail panel
│       │   │   ├── EmptyState.tsx       ← Empty list placeholder
│       │   │   ├── LoadingState.tsx     ← Loading spinner/skeleton
│       │   │   ├── ModernTable.tsx      ← Styled data table
│       │   │   ├── NotificationDropdown.tsx ← Bell icon notification list
│       │   │   ├── PageHeader.tsx       ← Consistent page title + subtitle
│       │   │   ├── SearchBar.tsx        ← Search input component
│       │   │   ├── StatCard.tsx         ← Dashboard statistic card
│       │   │   ├── StatusBadge.tsx      ← Coloured status pill (paid/pending)
│       │   │   └── UserMenu.tsx         ← Top-right user avatar dropdown
│       │   │
│       │   ├── ui/                ← Shadcn/Radix primitive components
│       │   │   └── *.tsx          ← button, dialog, input, select, tabs, etc.
│       │   │
│       │   └── figma/
│       │       └── ImageWithFallback.tsx ← Image with error fallback
│       │
│       ├── data/
│       │   └── residents.ts       ← Static array of 25 residents (blocks A–E)
│       │
│       ├── services/              ← API call functions (used by components)
│       │   ├── api.ts             ← Base HTTP client (fetch wrapper with auth header)
│       │   ├── authService.ts     ← Login, logout, register API calls
│       │   ├── complaintService.ts← CRUD for complaints
│       │   ├── maintenanceService.ts ← Maintenance payment API calls
│       │   ├── noticeService.ts   ← Notice/announcement API calls
│       │   ├── residentService.ts ← Resident listing API calls
│       │   └── visitorService.ts  ← Visitor log API calls
│       │
│       ├── hooks/
│       │   └── useApi.ts          ← Generic React hook: loading/error/data state
│       │
│       └── styles/
│           └── globals.css        ← Extended global styles and Tailwind utilities
│
└── server/                        ← Backend (Node.js + Express + MongoDB)
    ├── .env                       ← SECRET: MONGO_URI, JWT_SECRET, PORT
    ├── .gitignore                 ← Ignores node_modules, .env, uploads
    ├── server.js                  ← App entry: Express setup, route mounting
    ├── package.json               ← Backend dependencies and scripts
    │
    ├── config/
    │   ├── db.js                  ← Mongoose connection to MongoDB Atlas
    │   └── multer.js              ← Multer config for file uploads
    │
    ├── models/                    ← Mongoose schemas (MongoDB collections)
    │   ├── User.js                ← User schema: name, email, password, role, flat
    │   ├── Complaint.js           ← Complaint schema: title, description, status
    │   ├── Notice.js              ← Notice/announcement schema
    │   ├── Maintenance.js         ← Maintenance payment record schema
    │   └── Visitor.js             ← Visitor entry log schema
    │
    ├── controllers/               ← Business logic for each resource
    │   ├── authController.js      ← Register, login, get current user
    │   ├── complaintController.js ← Create, list, update, delete complaints
    │   ├── noticeController.js    ← Create, list, delete notices
    │   ├── maintenanceController.js ← Payment records, update status
    │   ├── visitorController.js   ← Add visitor, check-in/out, list
    │   ├── residentController.js  ← List residents, get by flat
    │   └── adminController.js     ← Bulk import residents from Excel file
    │
    ├── routes/                    ← Express route definitions
    │   ├── authRoutes.js          ← POST /api/auth/login, /register, /me
    │   ├── complaintRoutes.js     ← /api/complaints (CRUD)
    │   ├── noticeRoutes.js        ← /api/notices (CRUD)
    │   ├── maintenanceRoutes.js   ← /api/maintenance (CRUD)
    │   ├── visitorRoutes.js       ← /api/visitors (CRUD)
    │   ├── residentRoutes.js      ← /api/residents (list, get)
    │   └── adminRoutes.js         ← POST /api/admin/import-residents (Excel upload)
    │
    ├── middleware/
    │   ├── authMiddleware.js      ← Verifies JWT token on protected routes
    │   ├── errorMiddleware.js     ← Global error handler (returns JSON errors)
    │   └── roleMiddleware.js      ← Restricts routes to admin-only access
    │
    ├── utils/
    │   ├── generateToken.js       ← Creates a signed JWT for a user
    │   ├── seedAdmin.js           ← One-time script: creates admin "Jayawant Gore"
    │   └── importResidents.js     ← CLI script: bulk-import residents from Excel
    │
    └── uploads/                   ← Temporary storage for uploaded Excel files
        └── .gitkeep               ← Keeps the empty folder in git
```

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS |
| UI        | Shadcn/UI, Radix UI primitives           |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB (Atlas), Mongoose ODM            |
| Auth      | JWT (jsonwebtoken), bcryptjs             |
| File I/O  | Multer (upload), xlsx (Excel parsing)    |

---

## How to Run

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://cloud.mongodb.com) account

### 1. Configure the backend
Open `server/.env` and replace the `MONGO_URI` placeholder with your real Atlas URI:
```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/housing_society_hub?retryWrites=true&w=majority
```

### 2. Install dependencies
```powershell
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Seed the admin account (once only)
```powershell
cd server
node utils/seedAdmin.js
```
This creates the admin login: `admin@society.com` / `demo123`

### 4. Start the backend
```powershell
cd server
npm run dev
# Expected: "Server running on port 5000" + "MongoDB connected"
```

### 5. Start the frontend
```powershell
cd client
npm run dev
# Expected: Vite ready at http://localhost:3000
```

Open `http://localhost:3000` and log in with `admin@society.com` / `demo123`.
