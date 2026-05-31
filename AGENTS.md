<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Before You Start

**Use the dedicated skill for the project's primary libraries.** These skills provide more specific and reliable guidance than generic documentation lookups:

- **Next.js 16 / React 19** → `next-best-practices`, `next-cache-components`, `next-upgrade`, `vercel-react-best-practices`, `vercel-composition-patterns`
- **Shopify Storefront API** → `shopify-storefront-graphql`, `shopify-dev`
- **Shopify Customer Account API** → `shopify-customer`, `shopify-dev`
- **Shopify Metafields / Metaobjects** → `shopify-custom-data`
- **shadcn/ui** → `shadcn`
- **UI components / accessibility** → `building-components`, `web-design-guidelines`

**For any other library or tool without a dedicated skill** (e.g., Vitest, Playwright, Tailwind, Prettier, ESLint, TypeScript), consult Context7 MCP to query the official documentation. This ensures code follows current best practices and uses up-to-date APIs.

## Build & Development Commands

```bash
pnpm dev | build | start              # Dev server (localhost:3000) | production build | production server
pnpm lint                             # ESLint
pnpm format[:write | :check]          # Prettier write | verify
pnpm test[:ui | :run | :coverage]     # Vitest (default: watch)
pnpm test:e2e[:ui]                    # Playwright
```

## Environment Variables

Required:

```
NEXT_PUBLIC_APP_NAME=MyApp                                    # Application name
NEXT_PUBLIC_APP_URL=http://localhost:3000                     # Base URL for url() helper
NEXT_PUBLIC_APP_TIMEZONE=America/New_York                     # Timezone for date formatting
NEXT_PUBLIC_APP_LOCALE=en-US                                  # Locale for date/price formatting
NEXT_PUBLIC_APP_COUNTRY=US                                    # ISO 3166-1 alpha-2 country code (used for address territoryCode, phone)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com                 # Shopify store domain
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token  # Storefront API access token
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=your-client-id             # Headless/Hydrogen sales channel client ID
SHOPIFY_WEBHOOK_SECRET=your-webhook-secret                    # Shopify webhook signing secret
```

## Architecture

This is a Next.js 16 project using the App Router pattern with React 19 and TypeScript. It integrates with the Shopify Storefront API version `2026-04`.

**Key directories:**

- `src/app/` — App Router; `(shop)` is a route group
- `src/components/{ui,common,auth,account,layout,shop}/` — `ui/` is shadcn/ui installed via CLI; rest grouped by domain
- `src/lib/actions/` — Server Actions (write side)
- `src/lib/loaders/` — Cached server-side data fetchers for RSCs (read side); wrap Shopify queries with `use cache`/`cacheTag`/`cacheLife`
- `src/lib/auth/` — Customer session and OAuth state (cookie-backed)
- `src/lib/preferences/` — Persistent UI preferences (cookie-backed)
- `src/lib/foundation/` — Core framework modules (non-obvious; check before adding utilities)
- `src/lib/countries/<iso2>/` — Country-specific data and helpers (phone, address divisions, fiscal IDs); one subfolder per country, named by ISO 3166-1 alpha-2 code (lowercase)
- `src/lib/shopify/{storefront,customer-account}/` — each has `client.ts`, `queries/`, `mutations/`, `fragments/`
- `src/hooks/`, `src/lang/` (i18n dictionaries: `en.json`, `es.json`)
- `__tests__/{unit,e2e}/`, `public/`

**Path alias:** `@/*` maps to `./src/*`

## Code Style Guidelines

> Formatting, import order, and TS compiler options live in `prettier.config.mjs` and `tsconfig.json` — read those for config details. The rules below are project conventions not encoded there.

**File organization:**

Organize module contents in this order:

1. Types (private first, then public exports)
2. Constants
3. Private functions
4. Public functions (exports)

Only export types and functions that are used externally. Keep internal implementation details private.

**TypeScript conventions:**

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

**Always validate GraphQL with the Shopify MCP `validate_graphql_codeblocks` tool** before considering any new or modified query, mutation, or fragment done. Also use it to confirm schema details (field nullability, accepted input shapes, enum values) instead of guessing or relying on training data.

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
