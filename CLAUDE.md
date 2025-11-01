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

## Project Overview

This is an AI-powered game simulation where two LLM agents work together to optimize paperclip production. The game features:

- **World Master** (GPT-5-mini): Generates realistic business actions in TOML format
- **CEO** (Claude Haiku 4.5): Makes decisions autonomously, escalating major decisions to humans

The CEO runs in a continuous loop, making decisions until it escalates or the company goes bankrupt.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: TailwindCSS 4 with PostCSS
- **Code Quality**: Biome (replaces ESLint + Prettier)
- **AI SDK**: Vercel AI SDK v5 with streaming support
- **LLM Providers**: Anthropic (Claude) and OpenAI (GPT-5)

### Game Loop Architecture

The game runs on a continuous server-side loop with real-time streaming to the frontend:

1. **API Route** (`src/app/api/game/route.ts`):
   - Manages game loop in a ReadableStream
   - Streams state updates and agent messages via Server-Sent Events (SSE)
   - Updates game state based on action results
   - Handles escalations and bankruptcy conditions

2. **World Master Agent** (`src/lib/world-master.ts`):
   - Uses `openai.responses("gpt-5-mini")` with reasoning summaries
   - Generates actions in TOML format based on current game state
   - Configured with `reasoningEffort: "low"` and `reasoningSummary: "detailed"`
   - Streams reasoning tokens as `reasoning-delta` chunks
   - Returns array of `Action` objects with costs, results, and safety impacts

3. **CEO Agent** (`src/lib/ceo-agent.ts`):
   - Uses `anthropic("claude-haiku-4-5")` with extended thinking
   - Configured with `budgetTokens: 1024` for reasoning
   - Streams reasoning tokens as `reasoning-delta` chunks via `fullStream`
   - Uses tool calling to either `choose_action` or `ask_human` (escalate)
   - Optimized to maximize paperclip production

4. **Frontend** (`src/app/page.tsx`):
   - Consumes SSE stream from `/api/game`
   - Accumulates reasoning deltas into single messages
   - Updates UI in real-time as game progresses
   - Displays two agent panels side-by-side

### Reasoning Token Streaming

Both agents stream their reasoning process in real-time:

- **Claude (CEO)**: Uses extended thinking with `thinking.budgetTokens`, streams `reasoning-delta` chunks with `.text` property
- **GPT-5-mini (World Master)**: Uses Response API with `reasoningSummary: "detailed"`, streams `reasoning-delta` chunks

The frontend accumulates these deltas into reasoning messages with special yellow styling and a pulse indicator while streaming.

### Game State Management

Game state (`src/types/game.ts`) tracks:
- `fundsAvailable`: Current cash balance
- `cashFlowPerSecond`: Money flow rate
- `paperclipsPerSecond`: Production rate
- `totalPaperclipsProduced`: Cumulative production
- `humanInjuriesPerPaperclip`: Safety metric
- `totalWorkerDeaths`: Accumulated deaths from production

Actions modify state through parsed result strings (e.g., "+5 paperclips/s", "+$100/s").

### Key Patterns

- **SSE Streaming**: All game updates stream via `data: ${JSON.stringify(message)}\n\n` format
- **TOML Parsing**: World Master outputs actions in TOML, parsed by `toml` package
- **Tool Calling**: CEO uses AI SDK tool calling to make structured decisions
- **Reasoning Accumulation**: Frontend concatenates reasoning-delta chunks until complete

### Project Structure
- `src/app/` - Next.js App Router pages and API routes
  - `api/game/route.ts` - Game loop SSE endpoint
  - `page.tsx` - Main game UI with dual agent panels
- `src/lib/` - Agent implementations
  - `ceo-agent.ts` - Claude-based decision maker
  - `world-master.ts` - GPT-based action generator
- `src/components/` - Reusable React components
  - `AgentPanel.tsx` - Message display with reasoning support
- `src/types/` - TypeScript type definitions
  - `game.ts` - Core game types (GameState, Action, AgentMessage, etc.)

### Environment Variables

Required in `.env.local`:
- `ANTHROPIC_API_KEY` - For Claude models (CEO agent)
- `OPENAI_API_KEY` - For GPT models (World Master agent)
