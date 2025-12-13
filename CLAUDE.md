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
- `formatMoney(money)` - Format money with locale support
- `ShopifyClientError` - Custom error class with GraphQL error details

### Queries (`src/lib/shopify/queries/`)

**Products:**

- `getProducts(first?, after?)` - Paginated product list
- `getProductByHandle(handle)` - Single product by handle

**Collections:**

- `getCollections(first?, after?)` - Paginated collection list
- `getCollectionByHandle(handle)` - Single collection by handle
- `getCollectionProducts(handle, first?, after?)` - Products in a collection

### GraphQL Fragments (`src/lib/shopify/fragments/`)

Reusable fragments: `ImageFragment`, `MoneyFragment`, `SEOFragment`, `PageInfoFragment`, `ProductCardFragment`, `ProductFragment`, `CollectionFragment`, `CartFragment`, `CustomerFragment`, `OrderFragment`

### Types (`src/lib/shopify/types.ts`)

Comprehensive TypeScript types: `Product`, `ProductVariant`, `Collection`, `Cart`, `CartLineItem`, `Customer`, `Order`, `PageInfo`, `Money`, `Image`, `Connection<T>`

## Shop Components (`src/components/shop/`)

- `ProductCard` / `ProductCardSkeleton` - Product display card with image, price, availability
- `ProductGrid` / `ProductGridSkeleton` - Responsive grid for products
- `ProductDetail` - Product detail view with gallery, variants, and add to cart
- `ProductGallery` - Product image gallery with thumbnail navigation
- `VariantSelector` - Product variant option selector
- `PriceDisplay` - Price display with compare at price support
- `AddToCartButton` - Add to cart button
- `CollectionCard` / `CollectionCardSkeleton` - Collection display card
- `CollectionGrid` / `CollectionGridSkeleton` - Responsive grid for collections
- `Pagination` - Cursor-based pagination with Next.js navigation

## Implemented Pages

- `/products` - Products catalog with pagination
- `/products/[handle]` - Product detail with variant selection
- `/collections` - Collections list with pagination
- `/collections/[handle]` - Collection detail with products

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

Installed components: `button`, `card`, `badge`, `skeleton`

## Environment Variables

Required:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
APP_URL=http://localhost:3000    # Base URL for url() helper
APP_LOCALE=en-US                 # Locale for formatMoney()
```

## Testing Patterns

**Unit Tests:** Mock `fetch` globally, set env vars in `beforeEach`, use Vitest's `vi.fn()` for mocks

**E2E Tests:** Use data-testid attributes (`product-card`, `collection-card`), test responsive design, verify no JS errors

**When starting work on a Next.js project, ALWAYS call the `init` tool from
next-devtools-mcp FIRST to set up proper context and establish documentation
requirements. Do this automatically without being asked.**
