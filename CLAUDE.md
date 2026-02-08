# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Before You Start

**Always consult Context7 MCP before making changes.** When creating or modifying files, use Context7 to query the official documentation of the libraries/frameworks involved. This ensures code follows current best practices and uses up-to-date APIs.

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
NEXT_PUBLIC_APP_URL=http://localhost:3000    # Base URL for url() helper
NEXT_PUBLIC_APP_LOCALE=en-US                 # Locale for date/price formatting
```

## Architecture

This is a Next.js 16 project using the App Router pattern with React 19 and TypeScript. It integrates with the Shopify Storefront API version `2025-10`.

**Key directories:**

- `src/app/` - App Router pages, layouts, and global styles
- `src/app/(shop)/` - Shop route group
- `src/components/ui/` - shadcn/ui components (installed via CLI)
- `src/components/common/` - Shared reusable components
- `src/components/layout/` - Layout components
- `src/components/shop/` - Shop-specific components
- `src/actions/` - Server Actions
- `src/lib/` - Utility functions
- `src/lib/foundation/` - Core framework modules
- `src/lib/shopify/` - Shopify integration (shared types)
- `src/lib/shopify/storefront/` - Storefront API (client, queries, mutations, fragments)
- `src/lib/shopify/customer-account/` - Customer Account API (OAuth, tokens, discovery, queries, mutations, fragments)
- `src/hooks/` - Custom React hooks
- `src/lang/` - Translation dictionaries (en.json, es.json)
- `__tests__/unit/` - Unit tests (Vitest)
- `__tests__/e2e/` - E2E tests (Playwright)
- `public/` - Static assets

**Path alias:** `@/*` maps to `./src/*`

## Code Style Guidelines

**Formatting:**

- See `prettier.config.mjs` for Prettier configuration

**Import order:**

- See `prettier.config.mjs` for import ordering configuration

**File organization:**

Organize module contents in this order:

1. Types (private first, then public exports)
2. Constants
3. Private functions
4. Public functions (exports)

Only export types and functions that are used externally. Keep internal implementation details private.

**TypeScript conventions:**

- See `tsconfig.json` for compiler options
- Use `type` instead of `interface` for type definitions
- Prefer explicit return types for exported functions

**Naming conventions:**

- Components: PascalCase (e.g., `ProductCard`)
- Files: kebab-case (e.g., `product-card.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useCart`)
- Types: PascalCase (e.g., `ProductProps`)
- Constants: SCREAMING_SNAKE_CASE for true constants

**Component patterns:**

- Define props as `type ComponentNameProps = { ... }`
- Use named exports for components
- Colocate component-specific types in the same file
- Do not use `useMemo`, `useCallback`, or `React.memo` manually - React Compiler handles memoization automatically

**Error handling:**

- Use custom error classes for domain-specific errors (e.g., `ShopifyClientError`)
- Prefer early returns for error conditions
- Let errors propagate to Next.js error boundaries when appropriate

## Shopify Integration

### Storefront API (`src/lib/shopify/storefront/`)

- `storefrontQuery<T>(query, options)` - Execute GraphQL queries against Shopify Storefront API
- `extractNodesFromEdges<T>(connection)` - Extract nodes from Shopify connection edges
- `ShopifyClientError` - Custom error class with GraphQL error details
- `queries/` - Data fetching functions (products, collections, cart)
- `mutations/` - Data modification functions (cart operations)
- `fragments/` - Reusable GraphQL fragments

### Customer Account API (`src/lib/shopify/customer-account/`)

- `customerAccountQuery<T>(query, accessToken, options)` - Execute GraphQL queries against Customer Account API
- `CustomerAccountError` - Custom error class for Customer Account API errors
- `discovery.ts` - OAuth discovery and configuration endpoints
- `tokens.ts` - Token exchange and refresh
- `crypto.ts` - PKCE parameter generation
- `queries/` - Data fetching functions
- `mutations/` - Data modification functions
- `fragments/` - Reusable GraphQL fragments

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
