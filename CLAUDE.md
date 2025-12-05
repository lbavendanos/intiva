# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev      # Start development server on http://localhost:3000
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

This is a Next.js 16 project using the App Router pattern with React 19 and TypeScript.

**Key directories:**

- `src/app/` - App Router pages and layouts
- `public/` - Static assets

**Path alias:** `@/*` maps to `./src/*`

## Code Style

- **No semicolons**
- **Single quotes**
- **2-space indentation**
- Tailwind classes are auto-sorted by Prettier
- Imports are auto-sorted by Prettier

## Technology Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Package Manager:** pnpm
- **React Compiler:** Enabled for automatic optimizations
