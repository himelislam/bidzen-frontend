# Online Auction Platform — Frontend Guidelines
**Project:** BidZen — Online Auction Platform  
**Stack:** React.js + Tailwind CSS + shadcn/ui + Axios  
**Deployment:** Vercel  

---

## Table of Contents

1. [Design System & Tokens](#1-design-system--tokens)
2. [Folder Structure](#2-folder-structure)
3. [Windsurf / AI Rules File](#3-windsurf--ai-rules-file)
4. [Component Standards](#4-component-standards)
5. [API Layer Standards](#5-api-layer-standards)
6. [State Management Standards](#6-state-management-standards)
7. [Routing Standards](#7-routing-standards)
8. [Form & Validation Standards](#8-form--validation-standards)
9. [Phase-by-Phase Frontend Implementation](#9-phase-by-phase-frontend-implementation)
10. [Page-by-Page Spec](#10-page-by-page-spec)
11. [Naming Conventions](#11-naming-conventions)
12. [Performance Rules](#12-performance-rules)
13. [Do Not Rules](#13-do-not-rules)
14. [Submission Checklist](#14-submission-checklist)

---

## 1. Design System & Tokens

### 1.1 Package Installation (as per plan.md)

```bash
# Core stack — from plan.md
npm create vite@latest bidzen-frontend -- --template react
cd bidzen-frontend

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui init
npm install -D @types/node
npx shadcn@latest init

# Axios — from plan.md
npm install axios

# Additional required packages
npm install react-router-dom          # routing
npm install react-hook-form           # form management
npm install @hookform/resolvers zod   # validation
npm install date-fns                  # date/time formatting (auction countdowns)
npm install lucide-react              # icons (comes with shadcn)
npm install react-hot-toast           # toast notifications
npm install zustand                   # lightweight state management
```

> **Rule:** Do not install any package not listed above without a clear reason. The plan.md stack is the law.

---

### 1.2 shadcn/ui Init Answers

When running `npx shadcn@latest init`, answer:

| Prompt | Answer |
|--------|--------|
| Style | Default |
| Base color | Slate |
| CSS variables | Yes |
| React Server Components | No |
| Components directory | `src/components/ui` |
| Utils | `src/lib/utils.ts` |

---

### 1.3 Global CSS Variables — `src/styles/globals.css`

This is your **single source of truth** for all visual values. Every component must use these variables. Never hardcode a color, radius, or font size anywhere.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ─── Brand Colors ─── */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;

    --primary: 220 91% 54%;           /* Blue — main CTAs, active badges */
    --primary-foreground: 0 0% 100%;

    --secondary: 215 20% 96%;
    --secondary-foreground: 222 47% 11%;

    --accent: 38 92% 50%;             /* Amber — "Closing Soon" urgency */
    --accent-foreground: 222 47% 11%;

    --destructive: 0 84% 60%;         /* Red — delete, admin deactivate */
    --destructive-foreground: 0 0% 100%;

    --muted: 210 20% 96%;
    --muted-foreground: 215 16% 47%;

    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 220 91% 54%;

    /* ─── Status Colors (auction states) ─── */
    --status-active: 142 71% 45%;     /* Green */
    --status-active-bg: 142 71% 95%;
    --status-closing: 38 92% 50%;     /* Amber */
    --status-closing-bg: 38 92% 95%;
    --status-closed: 215 16% 47%;     /* Gray */
    --status-closed-bg: 215 16% 95%;
    --status-scheduled: 220 91% 54%; /* Blue */
    --status-scheduled-bg: 220 91% 95%;

    /* ─── Radius ─── */
    --radius: 0.5rem;                 /* Used by ALL shadcn components */

    /* ─── Typography ─── */
    --font-sans: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  .dark {
    --background: 222 47% 6%;
    --foreground: 210 20% 98%;
    --primary: 220 91% 60%;
    --primary-foreground: 222 47% 6%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 20% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --card: 222 47% 8%;
    --card-foreground: 210 20% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --accent: 38 92% 55%;
  }
}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

Add to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
```

---

### 1.4 Tailwind Config — `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

### 1.5 Status Badge Color Standard

Auction status must always render consistently across every page. Use these exact mappings:

| Status | Badge class | Meaning |
|--------|------------|---------|
| `active` | `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200` | Bidding open |
| `closing_soon` | `bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200` | < 1 hour left |
| `scheduled` | `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200` | Not started |
| `closed` | `bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400` | Ended |
| `flagged` | `bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300` | Admin review |

"Closing soon" is computed client-side: if `status === 'active'` and `timeRemaining < 3600 seconds`, show amber.

---

## 2. Folder Structure

```
bidzen-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                        # all axios calls — one file per resource
│   │   ├── axiosInstance.js        # base axios config with interceptors
│   │   ├── auth.api.js
│   │   ├── auction.api.js
│   │   ├── bid.api.js
│   │   ├── feedback.api.js
│   │   └── admin.api.js
│   ├── assets/                     # static images, SVGs
│   ├── components/
│   │   ├── ui/                     # shadcn generated — do not edit manually
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── select.jsx
│   │   │   ├── label.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── separator.jsx
│   │   │   ├── avatar.jsx
│   │   │   └── skeleton.jsx
│   │   ├── layout/                 # page scaffolding
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PageWrapper.jsx     # consistent page max-width + padding
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   ├── auction/                # auction-specific components
│   │   │   ├── AuctionCard.jsx     # listing grid card
│   │   │   ├── AuctionGrid.jsx     # responsive grid wrapper
│   │   │   ├── AuctionStatusBadge.jsx
│   │   │   ├── CountdownTimer.jsx
│   │   │   ├── BidForm.jsx
│   │   │   ├── BidHistory.jsx
│   │   │   └── WinnerBanner.jsx
│   │   ├── feedback/
│   │   │   ├── FeedbackForm.jsx
│   │   │   └── FeedbackList.jsx
│   │   ├── admin/
│   │   │   ├── FlaggedAuctionRow.jsx
│   │   │   └── UserRow.jsx
│   │   └── shared/                 # generic reusable components
│   │       ├── EmptyState.jsx
│   │       ├── ErrorMessage.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── PageHeader.jsx
│   │       ├── PriceDisplay.jsx
│   │       └── ConfirmDialog.jsx
│   ├── hooks/                      # custom React hooks
│   │   ├── useAuth.js
│   │   ├── useCountdown.js
│   │   ├── useAuctions.js
│   │   ├── useBids.js
│   │   └── usePolling.js
│   ├── pages/                      # one file per route
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ExploreAuctionsPage.jsx
│   │   │   ├── AuctionDetailsPage.jsx
│   │   │   └── SellerProfilePage.jsx
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── buyer/
│   │   │   ├── MyBidsPage.jsx
│   │   │   └── FeedbackFormPage.jsx
│   │   ├── seller/
│   │   │   ├── SellerDashboardPage.jsx
│   │   │   ├── CreateListingPage.jsx
│   │   │   └── EditListingPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   └── UserManagementPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── store/                      # Zustand stores
│   │   ├── authStore.js
│   │   └── auctionStore.js
│   ├── styles/
│   │   └── globals.css             # CSS variables (section 1.3)
│   ├── utils/
│   │   ├── formatCurrency.js       # ৳ BDT formatting
│   │   ├── formatDate.js           # date-fns wrappers
│   │   ├── timeHelpers.js          # countdown, isClosingSoon
│   │   └── constants.js            # API_URL, POLLING_INTERVAL, etc.
│   ├── lib/
│   │   └── utils.js                # shadcn cn() utility
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx                  # all routes defined here
├── .env
├── .env.example
├── .windsurfrules
├── .gitignore
├── index.html
├── vite.config.js
└── package.json
```

---

## 3. Windsurf / AI Rules File — `.windsurfrules`

Place this file in the project root. Windsurf reads it before every code generation.

```
# BidZen Frontend — Windsurf AI Rules

## Stack
- React.js with Vite
- Tailwind CSS with shadcn/ui
- Axios for all HTTP requests
- react-hook-form + zod for all forms
- Zustand for global state
- date-fns for date formatting
- react-hot-toast for notifications
- react-router-dom for routing

## Component Rules
- ALWAYS use shadcn/ui components from src/components/ui/ for: Button, Card, Input,
  Badge, Dialog, Select, Label, Textarea, Avatar, Skeleton, Separator
- Import shadcn components: import { Button } from "@/components/ui/button"
- NEVER create custom button, input, or card components from scratch
- NEVER use <a> for internal navigation — always use react-router-dom <Link>
- NEVER use HTML <form> — always use react-hook-form's <form> via handleSubmit

## Styling Rules
- NEVER hardcode colors — use Tailwind semantic classes: bg-primary, text-foreground,
  text-muted-foreground, bg-muted, border-border, bg-destructive, text-accent
- NEVER use arbitrary Tailwind values like bg-[#4F46E5] or text-[14px]
- NEVER write inline style={{ color: '#...' }} for theme colors
- All color customization goes in src/styles/globals.css CSS variables ONLY
- Use Tailwind spacing scale: p-4, gap-6, mt-8 — never px values in className
- Border radius: always use rounded-lg, rounded-md, rounded-sm from config

## API Rules
- ALL API calls go through src/api/ files — never call axios directly in components
- Use the axiosInstance from src/api/axiosInstance.js for all requests
- Token is attached by the Axios request interceptor — never manually add Authorization header
- Handle loading, error, and empty states in every component that fetches data

## Auction Status Rules
- Compute "closing_soon" client-side: active auction with < 3600 seconds remaining
- Use AuctionStatusBadge component for ALL status displays — never render status text raw
- Use CountdownTimer component for ALL time-remaining displays

## State Rules
- Auth state (user, token, role) lives ONLY in src/store/authStore.js
- Read auth state with useAuth() hook — never read from Zustand directly in components
- Auction list state lives in src/store/auctionStore.js
- Component-local state (modal open, form values) uses useState

## Form Rules
- ALL forms use react-hook-form with zod resolver
- ALL form schemas defined in the same file as the form component
- Show inline error messages below each field using react-hook-form's formState.errors
- Disable submit button while isSubmitting is true

## Polling Rules
- Auction details page polls bid data every 15 seconds while auction is active
- Auction list page polls every 30 seconds
- Use usePolling custom hook from src/hooks/usePolling.js — never use raw setInterval
- Stop polling when auction status is 'closed' or component unmounts

## Currency Rules
- ALL prices displayed with formatCurrency() from src/utils/formatCurrency.js
- Display in BDT: ৳15,000 format
- Never display raw numbers for prices

## Naming Rules
- Page components: PascalCase ending in "Page" — e.g. AuctionDetailsPage
- Feature components: PascalCase describing function — e.g. BidForm, CountdownTimer
- Hooks: camelCase starting with "use" — e.g. useCountdown
- API files: camelCase ending in ".api.js" — e.g. auction.api.js
- Store files: camelCase ending in "Store.js" — e.g. authStore.js

## Do Not Rules
- Do NOT build WebSockets, real-time push, or Socket.io — use polling
- Do NOT build payment UI of any kind
- Do NOT create image upload UI in MVP
- Do NOT use Redux, MobX, or Context API for global state — use Zustand
- Do NOT use any CSS framework other than Tailwind + shadcn
- Do NOT add any package not already in package.json without a reason
```

---

## 4. Component Standards

### 4.1 shadcn Components to Install

Run these commands. Only install what you need, when you need it:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcdf@latest add input
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add avatar
npx shadcn@latest add skeleton
npx shadcn@latest add separator
npx shadcn@latest add alert
npx shadcn@latest add tabs
```

---

### 4.2 AuctionCard — Standard

Every auction card across the entire app must use this exact component. No exceptions.

```jsx
// src/components/auction/AuctionCard.jsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AuctionStatusBadge from "./AuctionStatusBadge";
import CountdownTimer from "./CountdownTimer";
import PriceDisplay from "@/components/shared/PriceDisplay";
import { useAuth } from "@/hooks/useAuth";

export default function AuctionCard({ auction }) {
  const { user } = useAuth();
  const isBuyer = user?.role === "buyer";
  const isActive = auction.status === "active";

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardContent className="flex-1 p-5">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-3">
          <AuctionStatusBadge status={auction.status} endTime={auction.endTime} />
          <span className="text-xs text-muted-foreground">{auction.seller?.name}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-base leading-snug mb-2 line-clamp-2">
          {auction.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {auction.description}
        </p>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Starting</span>
            <PriceDisplay amount={auction.startingPrice} className="text-muted-foreground" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-foreground">Highest bid</span>
            <PriceDisplay
              amount={auction.currentHighestBid || auction.startingPrice}
              className="text-lg font-bold text-primary"
            />
          </div>
        </div>

        {/* Countdown */}
        {isActive && (
          <div className="mt-3 pt-3 border-t border-border">
            <CountdownTimer endTime={auction.endTime} />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0 gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/auctions/${auction._id}`}>View Details</Link>
        </Button>
        {isBuyer && isActive && (
          <Button asChild size="sm" className="flex-1">
            <Link to={`/auctions/${auction._id}`}>Place Bid</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

---

### 4.3 AuctionStatusBadge — Standard

```jsx
// src/components/auction/AuctionStatusBadge.jsx
import { Badge } from "@/components/ui/badge";
import { isClosingSoon } from "@/utils/timeHelpers";

const STATUS_CONFIG = {
  active: { label: "Active", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  closing_soon: { label: "Closing Soon", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  flagged: { label: "Flagged", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export default function AuctionStatusBadge({ status, endTime }) {
  const effectiveStatus =
    status === "active" && isClosingSoon(endTime) ? "closing_soon" : status;

  const config = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.closed;

  return (
    <Badge className={`text-xs font-medium border-0 ${config.className}`}>
      {config.label}
    </Badge>
  );
}
```

---

### 4.4 CountdownTimer — Standard

```jsx
// src/components/auction/CountdownTimer.jsx
import { useCountdown } from "@/hooks/useCountdown";

export default function CountdownTimer({ endTime, showLabel = true }) {
  const { hours, minutes, seconds, isExpired } = useCountdown(endTime);

  if (isExpired) {
    return <span className="text-sm text-muted-foreground">Auction ended</span>;
  }

  const isUrgent = hours === 0 && minutes < 10;

  return (
    <div className="flex items-center gap-1">
      {showLabel && (
        <span className="text-xs text-muted-foreground mr-1">Ends in</span>
      )}
      <span className={`font-mono text-sm font-semibold tabular-nums ${isUrgent ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
```

---

### 4.5 PriceDisplay — Standard

```jsx
// src/components/shared/PriceDisplay.jsx
import { formatCurrency } from "@/utils/formatCurrency";

export default function PriceDisplay({ amount, className = "" }) {
  return (
    <span className={className}>
      {formatCurrency(amount)}
    </span>
  );
}
```

---

### 4.6 EmptyState — Standard

```jsx
// src/components/shared/EmptyState.jsx
export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <span className="text-2xl text-muted-foreground">📭</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {action && action}
    </div>
  );
}
```

Usage: `<EmptyState title="No active auctions yet" description="Check back soon." />`

---

### 4.7 PageWrapper — Standard

Every page must be wrapped in this. It enforces consistent max-width and horizontal padding everywhere.

```jsx
// src/components/layout/PageWrapper.jsx
export default function PageWrapper({ children, className = "" }) {
  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </main>
  );
}
```

---

### 4.8 ProtectedRoute and RoleRoute

```jsx
// src/components/layout/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

// src/components/layout/RoleRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
```

---

## 5. API Layer Standards

### 5.1 Axios Instance — `src/api/axiosInstance.js`

```js
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT automatically on every request
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — auto logout on expired token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

### 5.2 API Files Pattern

Each API file exports clean async functions. No axios calls anywhere else.

```js
// src/api/auction.api.js
import api from "./axiosInstance";

export const getAuctions = () => api.get("/api/auctions");
export const getAuctionById = (id) => api.get(`/api/auctions/${id}`);
export const createAuction = (data) => api.post("/api/auctions", data);
export const updateAuction = (id, data) => api.patch(`/api/auctions/${id}`, data);
export const deleteAuction = (id) => api.delete(`/api/auctions/${id}`);

// src/api/bid.api.js
import api from "./axiosInstance";

export const getBids = (auctionId) => api.get(`/api/auctions/${auctionId}/bids`);
export const placeBid = (auctionId, data) => api.post(`/api/auctions/${auctionId}/bids`, data);

// src/api/auth.api.js
import api from "./axiosInstance";

export const register = (data) => api.post("/api/auth/register", data);
export const login = (data) => api.post("/api/auth/login", data);

// src/api/feedback.api.js
import api from "./axiosInstance";

export const getFeedback = (auctionId) => api.get(`/api/auctions/${auctionId}/feedback`);
export const submitFeedback = (auctionId, data) => api.post(`/api/auctions/${auctionId}/feedback`, data);

// src/api/admin.api.js
import api from "./axiosInstance";

export const getFlaggedAuctions = () => api.get("/api/admin/auctions?flagged=true");
export const resolveFlag = (id) => api.patch(`/api/admin/auctions/${id}/resolve`);
export const getUsers = () => api.get("/api/admin/users");
export const deactivateUser = (id) => api.patch(`/api/admin/users/${id}/deactivate`);
```

---

## 6. State Management Standards

### 6.1 Auth Store — `src/store/authStore.js`

```js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "bidzen-auth" }   // persists to localStorage automatically
  )
);
```

### 6.2 useAuth Hook — `src/hooks/useAuth.js`

```js
// All components read auth through this hook — never import useAuthStore directly
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { token, user, setAuth, logout } = useAuthStore();
  const isAuthenticated = !!token;
  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  return { token, user, setAuth, logout, isAuthenticated, isBuyer, isSeller, isAdmin };
}
```

---

### 6.3 usePolling Hook — `src/hooks/usePolling.js`

```js
import { useEffect, useRef } from "react";

export function usePolling(callback, intervalMs, active = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;
    const tick = () => savedCallback.current();
    tick(); // run immediately on mount
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, active]);
}
```

---

### 6.4 useCountdown Hook — `src/hooks/useCountdown.js`

```js
import { useState, useEffect } from "react";

export function useCountdown(endTime) {
  const calculateRemaining = () => {
    const diff = Math.max(0, new Date(endTime) - new Date());
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      isExpired: diff === 0,
      totalSeconds: Math.floor(diff / 1000),
    };
  };

  const [remaining, setRemaining] = useState(calculateRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calculateRemaining()), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return remaining;
}
```

---

## 7. Routing Standards

### `src/router.jsx`

```jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RoleRoute from "./components/layout/RoleRoute";

// Pages
import HomePage from "./pages/public/HomePage";
import ExploreAuctionsPage from "./pages/public/ExploreAuctionsPage";
import AuctionDetailsPage from "./pages/public/AuctionDetailsPage";
import SellerProfilePage from "./pages/public/SellerProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import MyBidsPage from "./pages/buyer/MyBidsPage";
import FeedbackFormPage from "./pages/buyer/FeedbackFormPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import CreateListingPage from "./pages/seller/CreateListingPage";
import EditListingPage from "./pages/seller/EditListingPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { index: true, element: <HomePage /> },
      { path: "auctions", element: <ExploreAuctionsPage /> },
      { path: "auctions/:id", element: <AuctionDetailsPage /> },
      { path: "sellers/:id", element: <SellerProfilePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      // Authenticated — any role
      {
        element: <ProtectedRoute />,
        children: [
          // Buyer only
          {
            element: <RoleRoute allowedRoles={["buyer"]} />,
            children: [
              { path: "my-bids", element: <MyBidsPage /> },
              { path: "auctions/:id/feedback", element: <FeedbackFormPage /> },
            ],
          },
          // Seller only
          {
            element: <RoleRoute allowedRoles={["seller"]} />,
            children: [
              { path: "dashboard", element: <SellerDashboardPage /> },
              { path: "listings/create", element: <CreateListingPage /> },
              { path: "listings/:id/edit", element: <EditListingPage /> },
              // Sellers also access feedback route
              { path: "auctions/:id/feedback", element: <FeedbackFormPage /> },
            ],
          },
          // Admin only
          {
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              { path: "admin", element: <AdminDashboardPage /> },
              { path: "admin/users", element: <UserManagementPage /> },
            ],
          },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
```

---

## 8. Form & Validation Standards

All forms use react-hook-form + zod. Pattern is always:
1. Define zod schema in the same file
2. Use `useForm` with `zodResolver`
3. Show error messages inline below each field
4. Disable submit button while `isSubmitting`

### Example — BidForm

```jsx
// src/components/auction/BidForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { placeBid } from "@/api/bid.api";
import toast from "react-hot-toast";

const bidSchema = (minAmount) =>
  z.object({
    amount: z
      .number({ invalid_type_error: "Please enter a valid amount" })
      .min(minAmount + 1, `Bid must be more than ৳${minAmount.toLocaleString()}`),
  });

export default function BidForm({ auctionId, currentHighestBid, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(bidSchema(currentHighestBid)),
  });

  const onSubmit = async (data) => {
    try {
      await placeBid(auctionId, data);
      toast.success("Bid placed successfully!");
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place bid");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <Label htmlFor="bid-amount">Your Bid (৳)</Label>
        <Input
          id="bid-amount"
          type="number"
          placeholder={`Min. ৳${(currentHighestBid + 1).toLocaleString()}`}
          {...register("amount", { valueAsNumber: true })}
          className={errors.amount ? "border-destructive" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Placing bid..." : "Place Bid"}
      </Button>
    </form>
  );
}
```

---

## 9. Phase-by-Phase Frontend Implementation

> Match backend phases from plan.md. Build frontend only after the corresponding backend phase is deployed and tested on Render.

---

### Frontend Phase 1 — Project Setup (parallel to Backend Phase 1–2)

**Goal:** Working shell with routing, design system, and auth screens

Tasks:
- [ ] Run Vite + React setup
- [ ] Install all packages from Section 1.1
- [ ] Run shadcn init, answer as per Section 1.2
- [ ] Copy `globals.css` from Section 1.3
- [ ] Copy `tailwind.config.js` from Section 1.4
- [ ] Create full folder structure from Section 2
- [ ] Create `.windsurfrules` from Section 3
- [ ] Create `axiosInstance.js`, `authStore.js`, `useAuth.js`
- [ ] Create `App.jsx` with `<Outlet />` and `<Navbar />`, `<Footer />`
- [ ] Create `router.jsx` with all routes stubbed (pages can be empty placeholders)
- [ ] Create `Navbar.jsx` — logo, nav links, login/register or user menu based on auth state
- [ ] Create `LoginPage.jsx` with form (react-hook-form + zod)
- [ ] Create `RegisterPage.jsx` with role selector (buyer / seller)
- [ ] Connect login/register to `auth.api.js`
- [ ] On login success: call `setAuth(token, user)`, redirect to `/`
- [ ] On register success: redirect to `/login`
- [ ] Create `constants.js` with `VITE_API_URL`, `POLLING_INTERVAL_DETAIL = 15000`, `POLLING_INTERVAL_LIST = 30000`
- [ ] Create `formatCurrency.js`: `export const formatCurrency = (n) => '৳' + Number(n).toLocaleString('en-BD')`
- [ ] Create `timeHelpers.js` with `isClosingSoon(endTime)`
- [ ] Create all shared components: `EmptyState`, `LoadingSpinner`, `ErrorMessage`, `PageWrapper`, `PriceDisplay`
- [ ] Create `ProtectedRoute` and `RoleRoute`
- [ ] Deploy to Vercel with `VITE_API_URL` env variable pointing to Render

**Deliverable:** Login, register work end-to-end. Auth state persists on refresh. Wrong role redirects correctly.

---

### Frontend Phase 2 — Public Auction Browsing (parallel to Backend Phase 3)

**Goal:** Anyone can browse active auctions and view details

Tasks:
- [ ] Install shadcn: `button card badge skeleton separator`
- [ ] Create `auction.api.js` with `getAuctions`, `getAuctionById`
- [ ] Create `AuctionStatusBadge.jsx` (Section 4.3)
- [ ] Create `CountdownTimer.jsx` (Section 4.4) using `useCountdown` hook
- [ ] Create `AuctionCard.jsx` (Section 4.2)
- [ ] Create `AuctionGrid.jsx` — responsive grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- [ ] Create `ExploreAuctionsPage.jsx`:
  - Fetch `getAuctions()` on mount
  - Show skeleton cards while loading (use shadcn Skeleton)
  - Show `EmptyState` if no auctions
  - Show `AuctionGrid` with `AuctionCard` per item
  - Add basic search by title (client-side filter on `auction.title`)
  - Poll every 30 seconds using `usePolling`
- [ ] Create `HomePage.jsx`:
  - Hero section — platform tagline + CTA buttons "Explore Auctions" / "Start Selling"
  - Active auctions grid (first 6 results from `getAuctions()`)
  - "Closing Soon" section — filter active auctions where `isClosingSoon(endTime)` is true, sorted by endTime ascending
  - How it works — 3 steps: List → Bid → Win
  - Seller CTA section at the bottom
- [ ] Create `AuctionDetailsPage.jsx`:
  - Fetch auction by `:id`
  - Show title, full description, seller info, status badge
  - Show `PriceDisplay` for starting price and current highest bid (largest typography on page)
  - Show `CountdownTimer` while active
  - Show `BidHistory` list (fetch from `getBids()`)
  - Show `BidForm` only if `isBuyer && auction.status === 'active'`
  - Poll bids every 15 seconds while active using `usePolling`
  - Show `WinnerBanner` when `auction.status === 'closed' && auction.winner`
  - Show feedback section when closed (Phase 4)
- [ ] Create `SellerProfilePage.jsx`:
  - Fetch seller's auctions
  - Show seller name, listings grid filtered to that seller
- [ ] Add SEO: set `document.title` per page using `useEffect`

**Deliverable:** Browsing, searching, and viewing auctions works. Countdown ticks live. Bids auto-refresh.

---

### Frontend Phase 3 — Bidding (parallel to Backend Phase 4)

**Goal:** Buyers can place bids with full validation feedback

Tasks:
- [ ] Create `bid.api.js` with `getBids`, `placeBid`
- [ ] Create `BidForm.jsx` (Section 8) with zod validation
- [ ] Create `BidHistory.jsx`:
  - Sorted list of bids: bidder name, amount (PriceDisplay), timestamp (date-fns `formatDistanceToNow`)
  - Show "No bids yet" EmptyState if empty
- [ ] Mount `BidForm` inside `AuctionDetailsPage` — buyer only, active only
- [ ] On successful bid: refetch bids immediately + show toast
- [ ] Handle all error cases from API with descriptive toast messages:
  - Auction not active → "This auction is not currently accepting bids"
  - Bid too low → "Your bid must be higher than ৳X"
  - After end time → "This auction has closed"
- [ ] Disable `BidForm` and show message when auction closes mid-session
- [ ] Create `MyBidsPage.jsx` (buyer only):
  - List all bids placed by current user across all auctions
  - Group or sort by most recent
  - Show auction title as link, bid amount, timestamp, auction status

**Deliverable:** Buyers can bid successfully. Invalid bids show clear inline errors. My Bids page shows history.

---

### Frontend Phase 4 — Seller Dashboard (parallel to Backend Phase 3 CRUD)

**Goal:** Sellers can create and manage their listings

Tasks:
- [ ] Install shadcn: `select textarea dialog`
- [ ] Create `CreateListingPage.jsx`:
  - Form fields: title, description, startingPrice (number), startTime (datetime-local), endTime (datetime-local)
  - Zod schema: all required, startingPrice > 0, startTime in future, endTime after startTime
  - On success: redirect to `/dashboard`
- [ ] Create `EditListingPage.jsx`:
  - Pre-fill form with existing auction data
  - Only allowed if `auction.status === 'scheduled'`
  - If not scheduled: show read-only alert "This listing can no longer be edited"
- [ ] Create `SellerDashboardPage.jsx`:
  - Fetch seller's own auctions
  - Table or card list with: title, status badge, starting price, current highest bid, start/end time, action buttons
  - "Edit" button — only shown if `status === 'scheduled'`
  - "Delete" button with `ConfirmDialog` — only if `status === 'scheduled'`
  - "View" link for all listings
- [ ] Create `ConfirmDialog.jsx` using shadcn Dialog for delete confirmation
- [ ] After delete: remove from list and show toast "Listing deleted"

**Deliverable:** Sellers can create, edit, delete their scheduled listings. Dashboard shows all their auctions with correct action gating.

---

### Frontend Phase 5 — Post-Auction Feedback (parallel to Backend Phase 6)

**Goal:** Winners and sellers can leave reviews after auction closes

Tasks:
- [ ] Install shadcn: `avatar`
- [ ] Create `FeedbackForm.jsx`:
  - Star rating input (1–5) — render 5 clickable star icons from lucide-react
  - Textarea for reviewText (min 10, max 500 characters)
  - Zod schema: rating 1–5, reviewText min 10 max 500
  - Submit calls `submitFeedback(auctionId, { rating, reviewText })`
  - On success: show "Review submitted" and hide form
  - On duplicate error (409): show "You have already reviewed this auction"
- [ ] Create `FeedbackList.jsx`:
  - Fetch `getFeedback(auctionId)`
  - Show each review: reviewer name, rating stars, review text, date
  - Show EmptyState if no reviews yet
- [ ] Mount `FeedbackForm` + `FeedbackList` at the bottom of `AuctionDetailsPage` — only when `auction.status === 'closed'`
- [ ] Gate `FeedbackForm` display: show only to winning buyer or listing seller
- [ ] `WinnerBanner.jsx`:
  - Show only when `auction.status === 'closed' && auction.winner`
  - "🏆 Winner: [winner name]" with amber/accent styling

**Deliverable:** Closed auction page shows winner banner, feedback form (if eligible), and submitted reviews.

---

### Frontend Phase 6 — Admin Panel (parallel to Backend Phase 7)

**Goal:** Admin can manage flagged auctions and users

Tasks:
- [ ] Create `AdminDashboardPage.jsx` (admin role only):
  - Fetch `getFlaggedAuctions()`
  - Table with columns: auction title, seller, winning bid, starting price, flag reason, actions
  - "Resolve" button calls `resolveFlag(id)` → show success toast, remove from list
  - Show empty state if no flags
- [ ] Create `UserManagementPage.jsx` (admin role only):
  - Fetch `getUsers()`
  - Table: name, email, role, status (active/inactive), joined date, action
  - "Deactivate" button with `ConfirmDialog` → calls `deactivateUser(id)`
  - Show role badge for each user
- [ ] Add admin links to `Navbar.jsx` — visible only when `isAdmin`
- [ ] Protect admin routes with `RoleRoute allowedRoles={["admin"]}`

**Deliverable:** Admin can view all flagged auctions, resolve flags, view all users, and deactivate accounts.

---

### Frontend Phase 7 — Polish, SEO & Final QA

**Goal:** Production-ready, fully consistent, deployed

Tasks:
- [ ] Add `document.title` to every page via `useEffect`
- [ ] Add meta description to `index.html` for home page
- [ ] Add Open Graph tags to `AuctionDetailsPage` (title, description)
- [ ] Audit every page: are all status badges using `AuctionStatusBadge`?
- [ ] Audit every price display: is every number going through `formatCurrency`?
- [ ] Audit every form: is every field showing inline errors?
- [ ] Check mobile responsiveness on all 12 pages (320px, 768px, 1280px breakpoints)
- [ ] Check dark mode on all pages
- [ ] Add 404 page (`NotFoundPage.jsx`) with link back to home
- [ ] Verify polling stops cleanly on component unmount
- [ ] Verify logout clears Zustand store and redirects to `/`
- [ ] Verify expired token triggers auto-logout via Axios interceptor
- [ ] Final Vercel deployment — confirm `VITE_API_URL` is set to Render backend
- [ ] End-to-end lifecycle test: register buyer → register seller → create listing → bid → close → winner → feedback → admin reviews flag

**Deliverable:** Production deployed, fully tested, design consistent across all pages.

---

## 10. Page-by-Page Spec

| Page | Route | Auth | Key components |
|------|-------|------|---------------|
| Home | `/` | Public | Hero, AuctionGrid, CountdownTimer, How It Works |
| Explore | `/auctions` | Public | AuctionGrid, AuctionCard, search input, AuctionStatusBadge |
| Auction Details | `/auctions/:id` | Public (bid: buyer) | PriceDisplay, CountdownTimer, BidForm, BidHistory, WinnerBanner, FeedbackList |
| Seller Profile | `/sellers/:id` | Public | AuctionGrid filtered by seller |
| Login | `/login` | Public | react-hook-form, zod, Button |
| Register | `/register` | Public | react-hook-form, zod, role Select |
| My Bids | `/my-bids` | Buyer | Table of bids, PriceDisplay, AuctionStatusBadge |
| Feedback Form | `/auctions/:id/feedback` | Buyer or Seller | FeedbackForm, star rating |
| Seller Dashboard | `/dashboard` | Seller | Listing table, status badges, Edit/Delete buttons |
| Create Listing | `/listings/create` | Seller | Full form, zod, datetime inputs |
| Edit Listing | `/listings/:id/edit` | Seller | Pre-filled form, scheduled-only guard |
| Admin Dashboard | `/admin` | Admin | FlaggedAuctionRow table, resolve button |
| User Management | `/admin/users` | Admin | UserRow table, deactivate button |
| 404 | `*` | Public | EmptyState variant, back-to-home link |

---

## 11. Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Page components | PascalCase + "Page" suffix | `AuctionDetailsPage.jsx` |
| Feature components | PascalCase, descriptive | `BidForm.jsx`, `CountdownTimer.jsx` |
| shadcn components | lowercase (generated) | `button.jsx`, `card.jsx` |
| Hooks | camelCase + "use" prefix | `useCountdown.js`, `useAuth.js` |
| API files | camelCase + ".api.js" | `auction.api.js` |
| Store files | camelCase + "Store.js" | `authStore.js` |
| Utility files | camelCase | `formatCurrency.js` |
| CSS classes | Tailwind only — no custom class names except rare cases |
| Route paths | kebab-case | `/my-bids`, `/listings/create` |
| Env variables | SCREAMING_SNAKE with VITE_ prefix | `VITE_API_URL` |

---

## 12. Performance Rules

- Use `usePolling` hook — never raw `setInterval` in components
- Always cancel polling on unmount (handled by `usePolling`)
- Use shadcn `Skeleton` while data is loading — never show blank areas
- Use `line-clamp-2` on card descriptions — no layout shift from long text
- Never load all auctions without limit — implement pagination in Phase 7 if count grows
- Keep the React bundle lean — no heavy libraries not listed in Section 1.1
- Use `React.lazy` + `Suspense` for admin pages (they are rarely accessed)
- Use `date-fns` functions only — never `moment.js`
- All dates received from API are UTC strings — always parse with `new Date()`

---

## 13. Do Not Rules

- Do **not** call axios directly in any component — always go through `src/api/*.api.js`
- Do **not** read `useAuthStore` directly in components — always use `useAuth()` hook
- Do **not** write inline `style={{ color: '#...' }}` for theme values
- Do **not** use arbitrary Tailwind values: `bg-[#4F46E5]`, `w-[347px]`, `text-[13px]`
- Do **not** create any new button, input, or card component — use shadcn
- Do **not** navigate with `window.location.href` except the auto-logout in `axiosInstance.js`
- Do **not** display a price number without `formatCurrency()`
- Do **not** display auction status as raw text — always use `AuctionStatusBadge`
- Do **not** build WebSocket / Socket.io — polling only
- Do **not** build payment UI, image upload, email notifications, or proxy bidding

---

## 14. Submission Checklist

### Design Consistency
- [ ] All pages use `PageWrapper` for max-width and padding
- [ ] All auction statuses use `AuctionStatusBadge` — no raw text
- [ ] All prices use `formatCurrency()` and `PriceDisplay`
- [ ] All countdowns use `CountdownTimer` component
- [ ] All loading states use shadcn `Skeleton`
- [ ] All empty states use `EmptyState` component
- [ ] All error messages use `ErrorMessage` component or toast
- [ ] All forms use react-hook-form + zod with inline error messages
- [ ] No hardcoded colors anywhere — Tailwind semantic classes only

### Features
- [ ] Public: browse, search, view details, view bids, view seller profile
- [ ] Auth: register as buyer or seller, login, logout, persist on refresh
- [ ] Buyer: place bid with validation, view my bids, submit feedback after winning
- [ ] Seller: create listing, edit (scheduled only), delete (scheduled only), view dashboard, submit feedback
- [ ] Admin: view flagged auctions, resolve flags, view users, deactivate accounts
- [ ] Countdown live on active auction cards and detail page
- [ ] Bid list auto-refreshes every 15s on detail page
- [ ] Winner banner shown on closed auctions
- [ ] 404 page for unknown routes

### Technical
- [ ] `.windsurfrules` in project root
- [ ] `.env` gitignored, `.env.example` committed
- [ ] `VITE_API_URL` set on Vercel to Render backend URL
- [ ] Auto-logout on 401 response works
- [ ] Role-based route protection blocks wrong roles
- [ ] Polling stops on component unmount
- [ ] Mobile responsive at 320px, 768px, 1280px
- [ ] Dark mode works on all pages
- [ ] Page titles set per route