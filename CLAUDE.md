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
pnpm test:ui        # Run unit tests with Vitest UI
pnpm test:run       # Run unit tests once
pnpm test:coverage  # Run unit tests with coverage report
pnpm test:e2e       # Run E2E tests with Playwright
pnpm test:e2e:ui    # Run E2E tests with Playwright UI
```

## Environment Variables

Required:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
APP_URL=http://localhost:3000    # Base URL for url() helper
APP_LOCALE=en-US                 # Locale for date/price formatting
```

## Architecture

This is a Next.js 16 project using the App Router pattern with React 19 and TypeScript.

**Key directories:**

- `src/app/` - App Router pages, layouts, and global styles
- `src/app/(shop)/` - Shop route group (products, collections)
- `src/components/ui/` - shadcn/ui components (installed via CLI)
- `src/components/shop/` - Shop-specific components (cards, grids, pagination)
- `src/lib/` - Utility functions (`cn`, `url`)
- `src/lib/shopify/` - Shopify Storefront API integration
- `src/hooks/` - Custom React hooks
- `__tests__/unit/` - Unit tests (Vitest)
- `__tests__/e2e/` - E2E tests (Playwright)
- `public/` - Static assets

**Path alias:** `@/*` maps to `./src/*`

## Shopify Integration

### Client (`src/lib/shopify/client.ts`)

- `storefrontQuery<T>(query, options)` - Execute GraphQL queries against Shopify Storefront API
- `extractNodesFromEdges<T>(connection)` - Extract nodes from Shopify connection edges
- `ShopifyClientError` - Custom error class with GraphQL error details

### Queries

Located in `src/lib/shopify/queries/` - data fetching functions for Shopify resources.

## Testing Patterns

**Unit Tests (Vitest):**

- Use `vi.fn()` for trackable mocks, `vi.spyOn()` for existing methods
- Use `vi.mock(import('./module'))` with `importOriginal()` for partial mocking
- Use `vi.stubGlobal()` for browser globals (e.g., `IntersectionObserver`)
- Set env vars in `beforeEach`, reset mocks in `afterEach`

**React Testing Library:**

- Prefer accessible queries: `getByRole`, `getByLabelText`, `getByText`
- Use `userEvent` over `fireEvent` for realistic interactions
- Avoid `getByTestId` unless no accessible alternative exists

**E2E Tests (Playwright):**

- Use locators: `getByRole`, `getByText`, `getByTestId`
