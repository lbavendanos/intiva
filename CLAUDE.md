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
- `src/components/ui/` - shadcn/ui components
- `src/lib/` - Utility functions (includes `cn()` helper)
- `src/hooks/` - Custom React hooks
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
- **UI Components:** shadcn/ui (new-york style)
- **Icons:** Lucide React
- **Package Manager:** pnpm
- **React Compiler:** Enabled for automatic optimizations

## shadcn/ui

```bash
pnpm dlx shadcn@latest add <component>  # Add a new component
```

Components are installed in `src/components/ui/`. Use the `cn()` utility from `@/lib/utils` for conditional class merging.

## Git Commits

- Do not include "Generated with Claude Code" footer in commit messages
- Do not include "Co-Authored-By: Claude" in commit messages
- Keep commit messages concise and descriptive
