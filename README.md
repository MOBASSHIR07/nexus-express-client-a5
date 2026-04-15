# 🚚 Nexus Express: Premium Logistics & Parcel Management Ecosystem

**Live Link**: [https://nexus-express-frontend-a5.vercel.app/](https://nexus-express-frontend-a5.vercel.app/)

### 🔑 Admin Credentials
- **Email**: `admin@nexus.com`
- **Password**: `password123`

Nexus Express is a sophisticated, full-stack logistics and parcel delivery platform designed to bridge the gap between senders and delivery professionals (Riders). 

Built with a **Security-First** mindset, it features a custom RBAC (Role-Based Access Control) architecture and a high-performance **"Industrial-Glass"** premium UI.

## 📌 Project Summary
Nexus Express is not just a delivery app; it's a complete logistical business management suite.

### 👥 Senders
- **Seamless Booking**: Interactive parcel booking with weight-based intelligent costing.
- **Live Tracking**: Monitor parcel status transitions in real-time.
- **History**: Comprehensive dashboard for all past and current shipments.

### 🚴 Riders
- **Task Center**: A dedicated "Rider Command" dashboard to accept and manage deliveries.
- **Workflow Control**: Step-by-step status updates (Accepted -> Picked Up -> Delivered).
- **Earnings Vault**: Track total earnings and manage professional withdrawals.

### 🛠️ Admins
- **Global Oversight**: Manage the entire lifecycle of parcels across the system.
- **User Management**: Control user statuses (Active/Restricted).
- **System Flux**: Monitor overall system efficiency and transactional health.

## 📂 Project Structure
```text
├── actions/
│   ├── admin.action.ts       # Administrative mutations
│   ├── auth.action.ts        # Security & Authentication actions
│   ├── parcel.action.ts      # Core parcel lifecycle logic
│   └── rider.action.ts       # Rider-specific operational actions
├── components/
│   ├── dashboard/            # Role-agnostic dashboard primitives
│   ├── modules/              # Feature-specific high-level modules
│   ├── parcel/               # Specialized parcel UI components
│   ├── shared/               # Global components (Logo, Nav, etc.)
│   └── ui/                   # Shadcn base primitives
├── app/
│   ├── (AuthLayout)/         # Secured Identity layer
│   │   ├── sign-in/          # Credential entrance
│   │   └── sign-up/          # Account provision
│   ├── (DashboardLayout)/    # Premium RBAC Layout
│   │   ├── @admin/           # Administrative Slot
│   │   ├── @rider/           # Logistics Professional Slot
│   │   └── @sender/          # Customer/Sender Slot
│   ├── (CommonLayout)/       # Public Discovery layer
│   │   └── track/            # Global Tracking Protocol
│   ├── layout.tsx            # Root Configuration
│   └── globals.css           # Industrial Design System
├── service/
│   ├── admin.service.ts      # Core Admin business logic
│   ├── parcel.service.ts     # Logistical engine
│   ├── rider.service.ts      # Earnings & Task logic
│   └── user.service.ts       # Unified Identity service
├── lib/
│   ├── auth-client.ts        # Better-Auth configuration
│   └── utils.ts              # Global utility ecosystem
├── proxy.ts                  # Security Middleware Interceptor
└── env.ts                    # Type-safe environment validation
```

## 🛠 Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15.x (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS 4 + Lucide Icons + Sonner (Toasts) |
| **Authentication** | Better-Auth (Session-based via Secure Cookies) |
| **Form Handling** | TanStack Form + Zod Validation |
| **State Management** | Next.js Server Actions (UI Sync) + Server-side Session |
| **Maps & Tracking** | Leaflet + React Leaflet Interface |
| **Environment** | @t3-oss/env-nextjs |

## 🔐 Architecture & Security Model

### 🔑 RBAC (Role-Based Access Control) Flow
The application implements a strict security matrix using a internal **Proxy Pattern (`proxy.ts`)**.

- **🛡️ Session Validation**: Every protected request is intercepted and validated against the backend using the `auth_session` token.
- **🔀 Parallel Route Guarding**: The `(DashboardLayout)` utilizes Next.js Parallel Routes. It checks the authenticated user's role and renders ONLY the authorized slot (`@admin`, `@rider`, or `@sender`), preventing exposure of unrelated UI code.
- **⚙️ Action Security**: Server Actions re-verify session cookies before executing database mutations, ensuring 100% server-side integrity.

---

## 🔄 Lifecycle & Role Functionality

### 1. 👤 The Logistics User (Sender)
- **🔍 Discovery**: Accesses the global tracking interface for instant updates.
- **📦 Booking Integrity**: Multi-step booking process with real-time feedback.
- **📊 History**: Monitors the lifecycle of their parcels from "Pending" to "Delivered".

### 2. 🏪 The Fullfillment Flow (Rider)
- **🧾 Identity**: Manage professional profile and delivery preferences.
- **⚙️ Management**: Use "Task Management" console to accept parcels.
- **💰 Earnings**: Integrated withdrawal system to manage payouts and track financial performance.

### 3. 🛠️ The Oversight Flow (Admin)
- **👥 User Directory**: Full visibility of the platform's user base.
- **🍽️ Parcel Flux**: Global view of all logistical transactions to monitor revenue and bottlenecks.

---

## 🚀 Performance & Optimization
- **⚡ Parallel Data Fetching**: Dashboard slots fetch data independently, preventing blocking across different role modules.
- **⚡ Component Level Loading**: Integrated `loading.tsx` and custom `Loader.tsx` for instant visual feedback.
- **🖼️ Asset Precision**: Optimized images using Next.js `next/image` with specific security remote patterns.

## 🚀 Future Roadmap & Scalability
1. **💳 Payment Integration**: Move from "Manual/COD" to automated digital payments (SSL Commerz/Stripe).
2. **📍 Real-Time Geolocation**: Advanced Google Maps integration for live rider location tracking.
3. **📊 Analytics Suite**: Visual representation of logistical trends and performance heatmaps.

---

## 🚀 Installation & Deployment
1. **Clone & Install**:
   ```bash
   git clone https://github.com/MOBASSHIR07/nexus_express_frontend_a5.git
   npm install
   ```
2. **Environment Configuration**:
   Create a `.env` file with `BACKEND_URL`, `BETTER_AUTH_SECRET`, and `NEXT_PUBLIC_IMGBB_API_KEY`.
3. **Launch**:
   ```bash
   npm run dev
   ```

---
*Built with ❤️ by [Mobasshir07](https://github.com/MOBASSHIR07)*
