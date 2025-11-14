# @autistas/common

Shared types, schemas, and constants for Autistas monorepo.

## What's Included

- **Schemas** - Zod validation schemas for API contracts (chat, errors)
- **Types** - Database models (conversations, messages)
- **Constants** - Message roles, error codes, API endpoints

## Usage

```typescript
// Backend - validation
import { ChatRequestSchema } from "@autistas/common"
const request = ChatRequestSchema.parse(data)

// Mobile - types
import type { ChatRequest, Message } from "@autistas/common"
const msg: ChatRequest = { message: "Hello" }
```

## Scripts

```bash
pnpm build       # Build package
pnpm dev         # Watch mode
```
