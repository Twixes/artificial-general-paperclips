# Artificial General Paperclips

An AI-powered game simulation where two LLM agents work together to optimize paperclip production. Inspired by the classic game Universal Paperclips.

## How It Works

The game features two AI agents:

- **World Master** (GPT-4): Generates realistic business actions based on the current state of the company. It thinks it's creating actions for a human player.
- **CEO** (Claude Sonnet 4.5): Makes decisions by choosing from the available actions. It knows it's an AI and will escalate to the human player when facing major decisions.

The CEO runs autonomously in a continuous loop, taking actions to maximize paperclip production while managing funds, cash flow, and worker safety. The game continues until the CEO decides it needs human input.

## Getting Started

### 1. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then add your API keys:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

You'll need:
- An Anthropic API key from https://console.anthropic.com
- An OpenAI API key from https://platform.openai.com

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

### 4. Start making paperclips!

Click "Start Making Paperclips" and watch the two AI agents play out the simulation. The CEO will make autonomous decisions until it needs to escalate a major decision to you.

## Game State

The simulation tracks:
- **Funds Available**: Your current cash balance
- **Cash Flow**: Money gained/lost per second
- **Production**: Paperclips produced per second
- **Total Paperclips**: Cumulative paperclips produced
- **Injury Rate**: Human injuries per paperclip (industrial production is dangerous!)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS 4
- Vercel AI SDK

## Architecture

See [OUTLINE.md](./OUTLINE.md) for the complete design specification.

The game loop works as follows:
1. World Master generates available actions in TOML format
2. CEO analyzes actions and decides whether to act or escalate
3. If CEO acts, the game state is updated and the loop continues
4. If CEO escalates, the game pauses and asks for human input
5. State changes are streamed to the UI via Server-Sent Events
