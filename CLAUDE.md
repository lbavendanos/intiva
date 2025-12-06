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
```

## Architecture

This is a Next.js 16 project using the App Router pattern with React 19 and TypeScript.

**Key directories:**

- `src/app/` - App Router pages, layouts, and global styles
- `src/components/ui/` - shadcn/ui components (installed via CLI)
- `src/lib/` - Utility functions
- `src/hooks/` - Custom React hooks
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

- **Framework:** Next.js 16.0.7 with App Router
- **Language:** TypeScript 5.9.3 (strict mode)
- **React:** 19.2.1
- **React Compiler:** Enabled for automatic optimizations
- **Styling:** Tailwind CSS 4.1.17
- **UI Components:** shadcn/ui (new-york style)
- **Icons:** Lucide React
- **Package Manager:** pnpm

## shadcn/ui

```bash
pnpm dlx shadcn@latest add <component>  # Add a new component
```

Components are installed in `src/components/ui/`.
