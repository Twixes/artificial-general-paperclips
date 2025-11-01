# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start the development server at http://localhost:3000 with hot reload
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server (requires `pnpm build` first)

### Code Quality
- `pnpm lint` - Run Biome linter to check code quality
- `pnpm format` - Format code using Biome (auto-fixes formatting issues)

## Architecture

This is a Next.js 16 application using the App Router architecture.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: TailwindCSS 4 with PostCSS
- **Code Quality**: Biome (replaces ESLint + Prettier)
- **React**: v19 (latest)

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font family configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles and TailwindCSS directives
- `public/` - Static assets served at root
- Path alias `@/*` maps to `src/*`

### Key Configuration
- **Biome** (biome.json): Configured with Next.js and React recommended rules, import organization enabled
- **TypeScript**: Strict mode with `@/*` path alias for imports
- **TailwindCSS**: v4 configuration via PostCSS
