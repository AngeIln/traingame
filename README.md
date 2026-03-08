# TrainGame Monorepo

## Structure

- `apps/client`: frontend React + Vite + Zustand
- `apps/server`: API Fastify + WebSocket + simulation logic + Prisma
- `packages/shared`: shared gameplay constants and TypeScript types

## Scripts

At root:

- `npm run dev`: run client and server
- `npm run build`: build all workspaces
- `npm run lint`: lint all workspaces
- `npm run test`: run unit tests
- `npm run seed`: seed prisma database

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies with `npm install`.
3. Generate Prisma client: `npm run prisma:generate --workspace @traingame/server`.
4. Apply migration: `npm run prisma:migrate --workspace @traingame/server`.
5. Start development: `npm run dev`.
