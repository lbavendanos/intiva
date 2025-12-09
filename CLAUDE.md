# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev            # Start development server on http://localhost:3000
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run ESLint
pnpm format:write   # Format code with Prettier
pnpm format:check   # Check code formatting
pnpm test           # Run unit tests with Vitest (watch mode)
pnpm test:run       # Run unit tests once
pnpm test:coverage  # Run unit tests with coverage report
pnpm test:e2e       # Run E2E tests with Playwright
pnpm test:e2e:ui    # Run E2E tests with Playwright UI
```

## Architecture

This is a Next.js 16 project using the App Router pattern with React 19 and TypeScript.

**Key directories:**

- `src/app/` - App Router pages, layouts, and global styles
- `src/components/ui/` - shadcn/ui components (installed via CLI)
- `src/lib/` - Utility functions
- `src/lib/shopify/` - Shopify Storefront API client, types, and GraphQL fragments
- `src/hooks/` - Custom React hooks
- `__tests__/` - Test files (unit in `unit/`, E2E in `e2e/`)
- `public/` - Static assets

**Path alias:** `@/*` maps to `./src/*`

## Code Style

- **No semicolons**
- **Single quotes**
- **2-space indentation**
- **LF line endings**
- Tailwind classes are auto-sorted by Prettier
- Imports are auto-sorted by Prettier

## Technology Stack

- **Framework:** Next.js 16.0.8 with App Router (cacheComponents enabled)
- **Language:** TypeScript 5.9.3 (strict mode)
- **React:** 19.2.1
- **React Compiler:** Enabled for automatic optimizations
- **Styling:** Tailwind CSS 4.1.17
- **UI Components:** shadcn/ui (new-york style)
- **Icons:** Lucide React
- **E-commerce:** Shopify Storefront API (2025-10)
- **Unit Testing:** Vitest 4.x + Testing Library
- **E2E Testing:** Playwright (Chromium, Firefox, WebKit, Mobile)
- **Package Manager:** pnpm

## shadcn/ui

```bash
pnpm dlx shadcn@latest add <component>  # Add a new component
```

Components are installed in `src/components/ui/`.

## Environment Variables

Required for Shopify integration:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```
