# Cetus Frontend - Human Resource Management System

> Giao diện người dùng cho hệ thống Quản lý Nhân sự Cetus được xây dựng với Next.js 14, TypeScript và Tailwind CSS

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Tổng quan

**Cetus Frontend** là ứng dụng web quản lý nhân sự (HRM) với giao diện người dùng hiện đại, responsive và có phân quyền theo vai trò. Ứng dụng cung cấp đầy đủ chức năng quản lý tổ chức, nhân viên, chấm công, nghỉ phép, lương bổng cho các vai trò khác nhau trong tổ chức.

### Tính năng chính

#### 🔐 Xác thực & Phân quyền

- Đăng nhập/đăng ký với JWT authentication
- Role-Based Access Control (RBAC): OWNER, ADMIN, MANAGER, USER
- Tự động giải mã JWT và ẩn/hiện chức năng theo vai trò
- Protected routes với middleware Next.js
- Auto redirect khi token hết hạn (401)

#### 👥 Quản lý Nhân viên (OWNER/ADMIN)

- Tạo hồ sơ nhân viên mới với đầy đủ thông tin
- Tạo tài khoản đăng nhập riêng biệt cho nhân viên
- Upload và quản lý ảnh đại diện
- Xem lịch sử thay đổi nhân viên
- Xóa nhân viên (có bảo vệ owner)
- Quản lý chứng chỉ và tài khoản ngân hàng

#### 🏗️ Quản lý Cơ cấu Tổ chức

- Quản lý phòng ban (Department)
- Quản lý nhóm/team
- Quản lý chức danh (Job Title)
- Phân công nhân viên vào team

#### ⏰ Chấm công & Nghỉ phép

- Ghi nhận chấm công hàng ngày
- Xem lịch sử chấm công
- Tạo yêu cầu nghỉ phép
- Duyệt/từ chối nghỉ phép (MANAGER/ADMIN/OWNER)
- Báo cáo chấm công

#### 💰 Quản lý Lương

- Xem bảng lương cá nhân (USER)
- Quản lý lương nhân viên (ADMIN/OWNER)
- Quản lý lương theo team (MANAGER)
- Báo cáo lương tổng hợp

#### 🎨 Giao diện & Trải nghiệm

- Dark/Light mode (nếu có)
- Responsive design (mobile, tablet, desktop)
- Loading states & skeleton loaders
- Toast notifications
- Modal dialogs
- Data tables với sorting, filtering, pagination
- Form validation với Zod + React Hook Form

---

## 🛠️ Công nghệ Sử dụng

### Core Framework

- **Next.js 14.2** - React framework với App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe development

### Styling & UI

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Headless UI components (accessible)
  - Dialog, Dropdown, Select, Checkbox, Label, Tabs, Toast, Scroll Area, Separator, Slot
- **Lucide React** - Icon library
- **class-variance-authority** - Variant-based styling
- **tailwind-merge** - Merge Tailwind classes
- **tailwindcss-animate** - Animation utilities

### Form & Validation

- **React Hook Form 7.53** - Form state management
- **Zod 3.23** - Schema validation
- **@hookform/resolvers** - Zod + React Hook Form integration

### Data Management

- **TanStack Table (React Table) 8.20** - Powerful table library
- **Recharts 2.13** - Chart library cho dashboard

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Type checking

### Deployment

- **PM2** - Process manager cho production
- **Docker** - Containerization

---

## 🏗️ Kiến trúc Frontend

### Luồng dữ liệu

```
┌─────────────────────────────────────────────────────────┐
│                User Browser                             │
└─────────────────────────┬───────────────────────────────┘
                          │
                          │ HTTP Request
                          ↓
┌─────────────────────────────────────────────────────────┐
│           Next.js 14 App Router                         │
│         http://localhost:3000                           │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │  Middleware (Auth Check)                      │    │
│  │  - Verify JWT token                           │    │
│  │  - Redirect if unauthorized                   │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │  Layout (dashboard)                           │    │
│  │  - Menu (role-based)                          │    │
│  │  - Sidebar navigation                         │    │
│  │  - User info                                  │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │  Page Components                              │    │
│  │  - Employee, Department, Team...              │    │
│  │  - Attendance, Leave, Salary...               │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │  Reusable Components                          │    │
│  │  - DataTable, Modal, Form...                  │    │
│  │  - CreateEmployeeModal                        │    │
│  │  - CreateAccountModal                         │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │  API Client (lib/api/)                        │    │
│  │  - users.ts                                   │    │
│  │  - employees.ts (implied)                     │    │
│  │  - JWT from localStorage                      │    │
│  └───────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          │ REST API + JWT Bearer Token
                          ↓
┌─────────────────────────────────────────────────────────┐
│             Backend API (Quarkus)                       │
│           http://localhost:8080                         │
└─────────────────────────────────────────────────────────┘
```

### Luồng Authentication

```
User Login
    ↓
POST /auth/login (email, password)
    ↓
Backend verify credentials
    ↓
Return JWT token + role
    ↓
Frontend:
  - localStorage.setItem("token", jwt)
  - localStorage.setItem("role", role)
  - Redirect to /home
    ↓
Every API call:
  - Get token from localStorage
  - Add header: Authorization: Bearer <token>
    ↓
Backend verify JWT & role
    ↓
If 401 Unauthorized:
  - Frontend clear localStorage
  - Redirect to /login
```

### Role-Based UI Rendering

```
Component Mount
    ↓
useRole() hook
    ↓
getRoleFromToken() (utils/jwtDecode.ts)
    ↓
Decode JWT from localStorage
    ↓
Extract role from "groups" claim
    ↓
Component re-render with role
    ↓
Conditional rendering:
  - OWNER/ADMIN: See all features
  - MANAGER: See employees (read-only), team mgmt
  - USER: See personal info, attendance, salary
```

---

## 📂 Cấu trúc Thư mục

```
cetus-ui-master/
│
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles
│   │   ├── loading.tsx               # Loading component
│   │   │
│   │   ├── (dashboard)/              # Dashboard group (protected)
│   │   │   ├── layout.tsx            # Dashboard layout với menu
│   │   │   ├── home/                 # Dashboard home
│   │   │   │   └── page.tsx
│   │   │   ├── employee/             # Quản lý nhân viên
│   │   │   │   └── page.tsx
│   │   │   ├── department/           # Quản lý phòng ban
│   │   │   │   └── page.tsx
│   │   │   ├── team/                 # Quản lý team
│   │   │   │   └── page.tsx
│   │   │   ├── job-title/            # Quản lý chức danh
│   │   │   │   └── page.tsx
│   │   │   ├── attendance/           # Chấm công
│   │   │   │   └── page.tsx
│   │   │   ├── leave/                # Nghỉ phép
│   │   │   │   └── page.tsx
│   │   │   ├── salary/               # Lương cá nhân
│   │   │   │   └── page.tsx
│   │   │   ├── salary-management/    # Quản lý lương (ADMIN)
│   │   │   │   └── page.tsx
│   │   │   ├── team-salary/          # Lương team (MANAGER)
│   │   │   │   └── page.tsx
│   │   │   ├── personal/             # Thông tin cá nhân
│   │   │   │   └── page.tsx
│   │   │   ├── profile/              # Hồ sơ chi tiết
│   │   │   │   └── page.tsx
│   │   │   ├── change-password/      # Đổi mật khẩu
│   │   │   │   └── page.tsx
│   │   │   └── debug-jwt/            # Debug JWT (dev only)
│   │   │       └── page.tsx
│   │   │
│   │   ├── login/                    # Đăng nhập
│   │   │   └── page.tsx
│   │   ├── register/                 # Đăng ký tổ chức
│   │   │   └── page.tsx
│   │   ├── about/                    # Trang giới thiệu
│   │   │   └── page.tsx
│   │   ├── contact/                  # Trang liên hệ
│   │   │   └── page.tsx
│   │   ├── pricing/                  # Trang bảng giá
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/               # App-level components
│   │   │   ├── AvatarUploadDialog.tsx
│   │   │   ├── BankAccountInfo.tsx
│   │   │   ├── Breadcumbs.tsx
│   │   │   ├── CreateEmployeeModal.tsx
│   │   │   ├── DataTable.tsx         # Main data table component
│   │   │   ├── DeleteEmployeeModal.tsx
│   │   │   ├── EmployeeHistoryTable.tsx
│   │   │   ├── EventSideSheet.tsx
│   │   │   ├── HomeChart.tsx
│   │   │   └── Menu.tsx              # Navigation menu (role-based)
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── api.js                # API helper
│   │   │   └── jwtDecode.ts          # JWT decode & role extraction
│   │   │
│   │   ├── providers/                # Context providers
│   │   ├── features/                 # Feature modules
│   │   ├── fonts/                    # Custom fonts
│   │   └── i18n/                     # Internationalization
│   │
│   ├── components/                   # Shared components
│   │   ├── CreateAccountModal.tsx    # Tạo tài khoản user
│   │   ├── icon.tsx
│   │   ├── employee/                 # Employee components
│   │   │   ├── CreateEmployeeButton.tsx
│   │   │   ├── CreateEmployeeModal.tsx
│   │   │   └── examples.tsx
│   │   └── ui/                       # Radix UI components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── toast.tsx
│   │       └── ...
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-toast.ts
│   │   └── useRole.ts                # Role management hook
│   │
│   └── lib/                          # Libraries & utilities
│       ├── utils.ts                  # Common utilities (cn, etc.)
│       ├── api/                      # API clients
│       │   └── users.ts              # User API
│       └── types/                    # TypeScript types
│           └── employee.ts           # Employee types
│
├── public/                           # Static assets
│   └── ...
│
├── .eslintrc.json                    # ESLint config
├── .gitignore
├── components.json                   # Shadcn/ui config
├── Dockerfile                        # Docker config
├── next.config.mjs                   # Next.js config
├── next-env.d.ts                     # Next.js TypeScript declarations
├── package.json                      # Dependencies
├── postcss.config.mjs                # PostCSS config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── README.md
│
├── ARCHITECTURE_DIAGRAM.md           # Architecture documentation
├── DEPLOYMENT_CHECKLIST.md           # Deployment guide
├── EMPLOYEE_CREATION_GUIDE.md        # Employee feature guide
├── EMPLOYEE_CREATION_README.md       # Quick reference
├── IMPLEMENTATION_SUMMARY.md         # Implementation docs
├── QUICK_REFERENCE.md                # Quick reference
├── ROLE_BASED_UI_IMPLEMENTATION.md   # RBAC documentation
├── ROLE_UI_SUMMARY_VI.md             # RBAC summary (Vietnamese)
└── REFACTORING_SUMMARY.md            # Refactoring notes
```

---

## 🎨 UI Components & Design System

### Radix UI Components (Headless & Accessible)

Sử dụng các component từ Radix UI để đảm bảo accessibility (WCAG):

```typescript
// Dialog (Modal)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Dropdown Menu
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Form Controls
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Feedback
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

// Navigation
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

### Custom Components

#### DataTable (TanStack Table)

```tsx
// Bảng dữ liệu với sorting, filtering, pagination
<DataTable data={employees} columns={columns} refreshKey={refreshKey} />
```

#### CreateEmployeeModal

```tsx
// Modal tạo nhân viên mới (OWNER/ADMIN only)
<CreateEmployeeModal
  open={isOpen}
  onOpenChange={setIsOpen}
  onSuccess={() => setRefreshKey((prev) => prev + 1)}
/>
```

#### CreateAccountModal

```tsx
// Modal tạo tài khoản đăng nhập cho nhân viên
<CreateAccountModal
  open={isOpen}
  employee={selectedEmployee}
  onOpenChange={setIsOpen}
  onSuccess={handleAccountCreated}
/>
```

### Styling Utilities

```typescript
// cn() - Merge Tailwind classes
import { cn } from "@/lib/utils";

<div
  className={cn(
    "base-class",
    condition && "conditional-class",
    variant === "primary" && "primary-variant"
  )}
/>;

// cva() - Class variance authority
import { cva } from "class-variance-authority";

const buttonVariants = cva("base-button-class", {
  variants: {
    variant: {
      default: "bg-blue-500",
      destructive: "bg-red-500",
    },
    size: {
      default: "px-4 py-2",
      sm: "px-2 py-1",
    },
  },
});
```

---

## 🔐 Role-Based Access Control (RBAC)

### Hook: useRole()

```typescript
// src/hooks/useRole.ts
import { useRole } from "@/hooks/useRole";

function MyComponent() {
  const { role, isLoaded, hasRole } = useRole();

  // Chờ role load xong
  if (!isLoaded) return <Spinner />;

  // Kiểm tra role
  if (role === "ADMIN") {
    return <AdminFeature />;
  }

  // Kiểm tra nhiều roles
  if (hasRole(["OWNER", "ADMIN"])) {
    return <PrivilegedFeature />;
  }

  return <DefaultView />;
}
```

### Utility: jwtDecode

```typescript
// src/app/utils/jwtDecode.ts
import { getRoleFromToken, hasRole, hasAnyRole } from "@/app/utils/jwtDecode";

// Lấy role từ JWT trong localStorage
const role = getRoleFromToken(); // "OWNER" | "ADMIN" | "MANAGER" | "USER" | null

// Kiểm tra role
if (hasRole("OWNER")) {
  // Show owner-only features
}

if (hasAnyRole(["ADMIN", "OWNER"])) {
  // Show admin/owner features
}
```

### Role Matrix

| Feature               | OWNER | ADMIN | MANAGER | USER |
| --------------------- | ----- | ----- | ------- | ---- |
| **Menu Visibility**   |       |       |         |      |
| Home                  | ✅    | ✅    | ✅      | ✅   |
| Personal              | ✅    | ✅    | ✅      | ✅   |
| Attendance            | ✅    | ✅    | ✅      | ✅   |
| Employees             | ✅    | ✅    | ✅      | ❌   |
| Job Title             | ✅    | ✅    | ❌      | ❌   |
| Team                  | ✅    | ✅    | ❌      | ❌   |
| Department            | ✅    | ✅    | ❌      | ❌   |
| Salary Management     | ✅    | ✅    | ❌      | ❌   |
| Team Salary           | ✅    | ✅    | ✅      | ❌   |
| **Actions**           |       |       |         |      |
| Create Employee       | ✅    | ✅    | ❌      | ❌   |
| Create Account (User) | ✅    | ✅    | ❌      | ❌   |
| Delete Employee       | ✅    | ✅    | ❌      | ❌   |
| Delete Owner          | ❌    | ❌    | ❌      | ❌   |
| View Employee Details | ✅    | ✅    | ✅      | ❌   |
| View Employee History | ✅    | ✅    | ✅      | ❌   |
| Approve Leave         | ✅    | ✅    | ✅      | ❌   |
| Manage Salary         | ✅    | ✅    | ❌      | ❌   |
| View Personal Salary  | ✅    | ✅    | ✅      | ✅   |

---

## 🌐 API Integration

### API Client Structure

```typescript
// src/lib/api/users.ts
export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response.json();
}
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### API Endpoints Used

```typescript
// Authentication
POST / auth / login;
POST / sign - up;
GET / sign - up / current;

// Users
POST / users;
GET / users;
GET / users / { email };
PUT / users / { email };
DELETE / users / { email };

// Employees
GET / employees;
POST / employees;
GET / employees / { id };
PUT / employees / { id };
DELETE / employees / { id };

// Organization
GET / departments;
POST / departments;
GET / teams;
POST / teams;
GET / job - titles;
POST / job - titles;

// Attendance
GET / attendance;
POST / attendance;

// Leave
GET / leave - requests;
POST / leave - requests;
PUT / leave - requests / { id };

// Salary
GET / salary;
POST / salary;
```

---

## ⚙️ Cài đặt & Chạy Ứng dụng

### Yêu cầu Môi trường

| Công cụ       | Phiên bản | Bắt buộc |
| ------------- | --------- | -------- |
| Node.js       | 20+       | ✅       |
| npm/yarn/pnpm | Latest    | ✅       |
| Git           | 2.x       | ✅       |

### Hướng dẫn Cài đặt (Development)

#### Bước 1: Clone Repository

```bash
git clone <https://github.com/vienLTV/HR_FE.git>
cd cetus-ui-master
```

#### Bước 2: Cài đặt Dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

#### Bước 3: Cấu hình Environment

Tạo file `.env.local`:

```bash
# API Backend URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Optional: Base path nếu deploy trên subdirectory
# NEXT_PUBLIC_BASE_PATH=/app
```

#### Bước 4: Chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

**Dev Server sẽ:**

- Khởi động tại `http://localhost:3000`
- Hot reload khi sửa code
- Type checking tự động
- Fast refresh

#### Bước 5: Truy cập Ứng dụng

```
http://localhost:3000
```

**Đảm bảo Backend đang chạy:**

```bash
# Backend phải chạy tại http://localhost:8080
cd ../cetus-core-master
./mvnw quarkus:dev
```

### Scripts Available

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Type Checking
npx tsc --noEmit     # Check TypeScript types
```

---

## 🚀 Deployment (Production)

### Build Production

```bash
# 1. Install dependencies
npm ci --production=false

# 2. Build
npm run build

# Output: .next/ folder
```

### Run Production Server

#### Option 1: Next.js Standalone

```bash
npm run start
```

#### Option 2: PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "cetus-ui" -- start

# Other PM2 commands
pm2 list            # List processes
pm2 logs cetus-ui   # View logs
pm2 restart cetus-ui
pm2 stop cetus-ui
pm2 delete cetus-ui
```

#### Option 3: Docker

**Dockerfile:**

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**Build & Run:**

```bash
# Build image
docker build -t cetus-ui:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://backend:8080 \
  cetus-ui:latest
```

### Environment Variables (Production)

```bash
# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.cetus.site
NODE_ENV=production
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name cetus.site;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Cấu hình Chi tiết

### next.config.mjs

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable standalone output for Docker
  output: "standalone",

  // Image optimization
  images: {
    domains: ["localhost"],
    formats: ["image/avif", "image/webp"],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  // Webpack config
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
```

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 📊 State Management

### Local State (useState)

```typescript
const [employees, setEmployees] = useState<Employee[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Form State (React Hook Form)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});
```

### Global State (Custom Hooks)

```typescript
// useRole - Quản lý role toàn app
const { role, isLoaded, hasRole } = useRole();

// useToast - Quản lý notifications
const { toast } = useToast();

toast({
  title: "Success",
  description: "Employee created successfully",
});
```

### Data Fetching Pattern

```typescript
useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [refreshKey]); // Re-fetch when refreshKey changes
```

---

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```bash
npm install --save-dev @playwright/test
```

```typescript
// e2e/login.spec.ts
import { test, expect } from "@playwright/test";

test("user can login", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.fill('input[name="email"]', "admin@test.com");
  await page.fill('input[name="password"]', "password");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/home");
});
```

---

## 📈 Performance Optimization

### Code Splitting

```typescript
// Dynamic import cho heavy components
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  loading: () => <Spinner />,
  ssr: false, // Disable SSR for this component
});
```

### Image Optimization

```typescript
import Image from "next/image";

<Image
  src="/avatar.jpg"
  alt="Avatar"
  width={100}
  height={100}
  priority={false} // Lazy load
  quality={80}
/>;
```

### Memoization

```typescript
import { useMemo, useCallback } from "react";

// Memoize expensive calculations
const filteredData = useMemo(() => {
  return data.filter((item) => item.status === "active");
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

---

## 🛡️ Security Best Practices

### ✅ Implemented

- **JWT Storage**: localStorage (consider httpOnly cookies for production)
- **XSS Prevention**: React auto-escaping, no dangerouslySetInnerHTML
- **CSRF Protection**: SameSite cookies (if using cookies)
- **Input Validation**: Zod schema validation
- **Role-based UI**: Hide sensitive features from unauthorized users
- **Auto logout on 401**: Clear token and redirect to login

### ⚠️ Recommendations

- Move JWT to httpOnly cookies (more secure than localStorage)
- Implement refresh token mechanism
- Add CSRF tokens for state-changing operations
- Rate limiting on login attempts
- Content Security Policy (CSP) headers
- Regular dependency updates (`npm audit`)

---

## 📚 Documentation

### Existing Docs

- [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) - Visual architecture
- [ROLE_BASED_UI_IMPLEMENTATION.md](ROLE_BASED_UI_IMPLEMENTATION.md) - RBAC implementation
- [EMPLOYEE_CREATION_GUIDE.md](EMPLOYEE_CREATION_GUIDE.md) - Employee feature guide
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation summary
- [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) - Refactoring notes
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment checklist
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick reference

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScript errors

```bash
# Restart TypeScript server in VSCode
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Check types
npx tsc --noEmit
```

#### 3. API calls return 401

```typescript
// Check if token exists and is valid
const token = localStorage.getItem("token");
console.log("Token:", token);

// Decode JWT to check expiration
import { decodeJWT } from "@/app/utils/jwtDecode";
const payload = decodeJWT(token);
console.log("Expires:", new Date(payload.exp * 1000));
```

#### 4. CORS errors

- Ensure backend CORS is configured for `http://localhost:3000`
- Check `application.properties` in backend:
  ```properties
  quarkus.http.cors.origins=http://localhost:3000
  ```

---

## 📝 License

MIT License - See [LICENSE](LICENSE)

---

## 👥 Contributors

- **Team Cetus Development**
- Frontend Developer: [Your Name]
- UI/UX Designer: [Your Name]

---

## 📧 Contact & Support

- **Email:** support@cetus.site
- **Documentation:** [Wiki](wiki-link)
- **Issues:** [GitHub Issues](issues-link)

---

## 🔗 Related Projects

- **Backend:** [cetus-core-master](../cetus-core-master)
- **Mobile App:** (Coming soon)
- **Admin Panel:** (Coming soon)

---

**Made with ❤️ by Cetus Team**
