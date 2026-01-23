# Learnings - Coscientist App Build

## Task 0.1: Setup Test Infrastructure ✅

### Conventions Discovered
- Test files live in `src/__tests__/` directory
- Test script added to package.json as `"test": "vitest"`
- vitest.config.ts uses @vitejs/plugin-react for JSX support
- Path alias `@` configured to `./src` for imports

### Successful Approaches
- Installed all testing dependencies in one command: `bun add -d vitest @testing-library/react @testing-library/user-event jsdom`
- Also needed @vitejs/plugin-react for vitest config to work
- Simple test structure: describe → it → expect
- jsdom environment enables DOM testing for React components

### Technical Patterns
- vitest.config.ts configuration:
  - `environment: 'jsdom'` for DOM testing
  - `globals: true` allows describe/it/expect without imports
  - React plugin for JSX support
  - Path alias for clean imports
- Test file pattern: `src/__tests__/example.test.ts`
- All 3 example tests pass: basic math, string equality, array contains

### Dependencies Added
- vitest@4.0.18
- @testing-library/react@16.3.2
- @testing-library/user-event@14.6.1
- jsdom@27.4.0
- @vitejs/plugin-react@5.1.2

## Task 0.2: Initialize Convex Project ✅

### Key Findings

#### Vercel-Managed Team Constraint
- The Coscientist team on Convex is managed by Vercel
- Cannot create new projects directly via `bunx convex dev` with "create a new project" option
- Error: "ManagedTeamCannotCreateProjects: This team is managed by vercel. You may create new Convex projects in vercel."
- **Solution**: Use "choose an existing project" option - the "coscientist" project already exists

#### Interactive Setup Required
- `bunx convex dev --once` flag does NOT work in non-interactive terminals
- Must use interactive tmux session to complete setup
- Prompts:
  1. Configure existing project (coscientist)
  2. Choose deployment type (cloud vs local)
  3. Confirms and generates .env.local

#### Generated Files
- `convex/_generated/` directory created with:
  - `api.d.ts` - TypeScript types for API
  - `api.js` - API exports
  - `dataModel.d.ts` - Data model types
  - `server.d.ts` - Server context types
  - `server.js` - Server exports

#### Environment Variables
- `.env.local` created automatically with:
  - `CONVEX_DEPLOYMENT=dev:qualified-clam-176`
  - `NEXT_PUBLIC_CONVEX_URL=https://qualified-clam-176.convex.cloud`
- Must add to `.gitignore` (done automatically)
- Created `.env.local.example` with placeholders for documentation

#### Dev Server Integration
- `bun run dev` starts successfully with Convex configured
- No Convex-related errors on startup
- Next.js recognizes `.env.local` automatically

### Patterns for Future Tasks
1. **Interactive Convex Setup**: Always use tmux for `bunx convex dev` initialization
2. **Team Context**: Coscientist team is Vercel-managed - remember this for future deployments
3. **Existing Project**: Project "coscientist" already exists - reuse it
4. **Environment Pattern**: Keep `.env.local` in `.gitignore`, document in `.env.local.example`

### Dependencies Added
- convex@1.31.6

## Task 0.3: Create Convex Schema (Blocks + Edges) ✅

### Schema Structure

**Blocks Table (ADR 1: Unified Block Model)**
- All content (text, headings, lists, documents) stored as blocks - atomic units of knowledge
- Fields: `type`, `content`, `createdBy`, `createdAt`, `updatedAt`, `parentId?`, `access?`
- Block types: `"text" | "heading" | "list" | "document"`
- Index on `parentId` for efficient hierarchy queries

**Edges Table (ADR 4: Edge Types and Dialectical Graph)**
- Directed typed edges forming the knowledge graph
- Fields: `from`, `to`, `type`, `createdBy`, `createdAt`
- Edge types: `"contains" | "supports" | "refutes" | "references"`
- Indexes on both `from` and `to` for efficient graph traversal

### Implementation Patterns

1. **Type Safety with v.union(v.literal())**
   - Used Convex's validator pattern for enum-like types
   - Prevents invalid type values at schema level
   - Generated types are automatically strict

2. **Flexible Content Field**
   - Used `v.any()` for block content to support:
     - Plain text
     - JSON structures (ProseMirror, etc.)
     - File storage references
     - Future content types

3. **Index Strategy**
   - `blocks.by_parentId`: enables efficient document hierarchy traversal
   - `edges.by_from`: find outgoing edges (what this block points to)
   - `edges.by_to`: find incoming edges (what points to this block)
   - All indexes include `_creationTime` for sorting

4. **Reserved Fields**
   - `access` field marked optional and reserved for ADR 6 (permissions model)
   - Not implemented yet, but schema prepared for future expansion

### Convex Dev Output

Schema synced successfully with `bunx convex dev --once`:
```
✔ Added table indexes:
  [+] blocks.by_parentId   parentId, _creationTime
  [+] edges.by_from   from, _creationTime
  [+] edges.by_to   to, _creationTime
✔ 18:12:34 Convex functions ready! (2.62s)
```

Generated types in `convex/_generated/`:
- `api.d.ts`: Function exports (empty for now)
- `dataModel.d.ts`: Type-safe Doc<T> and Id<T> types
- `server.d.ts`: QueryCtx, MutationCtx types

### Key Patterns

1. **ADR Compliance**: Schema directly implements ADR 1 (blocks) and ADR 4 (edges)
2. **Graph Traversal Ready**: Indexes enable efficient 1-hop and multi-hop queries
3. **Extensibility**: New block/edge types can be added without schema changes
4. **Metadata Consistency**: All entities track `createdBy` and timestamps

## Task 0.4: Add Collaboration Schema (Steps, Snapshots, Presence) ✅

### Schema Additions

**Steps Table (ADR 2: Versioning Strategy)**
- Atomic changes for real-time collaborative editing via ProseMirror OT
- Fields: `documentId`, `stepData`, `version`, `clientId`, `timestamp`
- Compound index on `(documentId, version)` for efficient step retrieval
- Purpose: Enable OT-based conflict resolution and document reconstruction

**Snapshots Table (ADR 2: Versioning Strategy)**
- Periodic full-state checkpoints for efficient document reconstruction
- Fields: `documentId`, `version`, `contentState`, `timestamp`
- Purpose: Allow new collaborators to load latest snapshot + subsequent steps (not entire history)
- Enables history truncation: old steps can be archived after snapshot exists

**Presence Table (ADR 7: Presence and Cursors)**
- Real-time user awareness for collaborative editing
- Fields: `userId`, `documentId`, `lastActive`, `cursorPos?`, `status`
- Index on `documentId` for querying all users on a document
- Purpose: Track who is online/editing, enable UI indicators (avatars, typing status, cursors)

### Implementation Patterns

1. **Compound Indexing**
   - `steps.by_documentId_version`: enables efficient queries like "get all steps after version X for document Y"
   - Critical for OT rebasing and conflict resolution

2. **Flexible Data Fields**
   - `stepData: v.any()` stores ProseMirror step JSON (insert, delete, replace, etc.)
   - `contentState: v.any()` stores full ProseMirror document JSON
   - `cursorPos: v.optional(v.any())` allows block-level or position-based cursor tracking

3. **Presence Heartbeat Pattern**
   - `lastActive` timestamp enables grace period for detecting offline users
   - `status` field supports "editing" / "online" / "idle" states
   - Clients send periodic heartbeats to keep presence fresh

4. **Reference Integrity**
   - All tables reference `blocks` via `documentId: v.id("blocks")`
   - Maintains referential consistency with existing schema

### Convex Sync Result

Schema synced successfully with `bunx convex dev --once`:
```
✔ 18:16:16 Convex functions ready! (2.22s)
```

Generated types automatically include:
- `Doc<"steps">`, `Doc<"snapshots">`, `Doc<"presence">` types
- `Id<"steps">`, `Id<"snapshots">`, `Id<"presence">` types
- Full type safety for database operations

### Key Patterns

1. **Three-Tier Versioning**: Steps (fine-grained OT) → Snapshots (checkpoints) → User-facing versions (future)
2. **Performance Optimization**: Compound indexes enable efficient queries without full table scans
3. **Ephemeral + Persistent**: Presence data is semi-ephemeral (care about "now") but stored for durability
4. **ADR Compliance**: Directly implements ADR 2 (versioning) and ADR 7 (presence)

## Task 0.5: Permissions Schema + Shared Types ✅

### Completed
- ✅ Updated `convex/schema.ts` blocks table with proper ACL structure
- ✅ Created `convex/types.ts` with BlockType and EdgeType enums
- ✅ Created `apps/web/src/lib/convex-types.ts` for frontend re-exports
- ✅ TypeScript compilation passes without errors

### ACL Structure (ADR 6)
```typescript
access: v.object({
  readers: v.array(v.string()),    // User IDs who can read
  writers: v.array(v.string()),    // User IDs who can write
  public: v.boolean(),             // Viewable by anyone
  embargoUntil: v.optional(v.number()) // Time lock (timestamp in ms)
})
```

### Type Exports Pattern
- Backend types defined in `convex/types.ts` with enums and interfaces
- Frontend re-exports via `apps/web/src/lib/convex-types.ts`
- Uses `export type` for type-only exports, `export` for enums
- Path: `../../convex/types` (relative from src/lib)

### Enum Naming Convention
- PascalCase enum names: `BlockType`, `EdgeType`
- PascalCase enum values: `BlockType.Text`, `EdgeType.Contains`
- String literal values match schema validators: `"text"`, `"contains"`

### Schema Patterns
- Convex validators use `v.object()` for nested structures
- Optional fields use `v.optional()`
- Arrays use `v.array()`
- Timestamps stored as milliseconds (number type)
- Comments document field semantics and ADR references

### Files Modified
1. `apps/web/convex/schema.ts` - Updated blocks table access field
2. `apps/web/convex/types.ts` - New file with enums and interfaces
3. `apps/web/src/lib/convex-types.ts` - New file with re-exports
