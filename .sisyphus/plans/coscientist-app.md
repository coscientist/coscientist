# Coscientist App: Full Feature Build

## Context

### Original Request
User reviewed all HQ documents (ADRs 1-8, work logs) and requested a detailed work plan to build the full Coscientist app - a "cognitive exoskeleton" for knowledge production in the post-AI era.

### Interview Summary
**Key Discussions**:
- MVP Scope: ALL feature areas (PKM, Collaboration, Verification, AI)
- Build Strategy: All 4 streams in parallel (higher risk, faster delivery)
- App Location: Extend `apps/web` alongside existing manifesto
- Design Approach: Design as we build using existing Monolith aesthetic
- Testing: TDD (Test-Driven Development)

**Research Findings**:
- No Convex backend exists yet (`convex/` directory empty)
- Existing app has: Landing, Manifesto panes, Clerk auth, i18n (25 locales)
- ADRs 1-8 provide detailed technical decisions
- Sliding panes pattern already implemented for manifesto

### Metis Review
**Identified Gaps** (addressed):
- Block types undefined → Applied default: text, heading, list, document
- Edge types undefined → Applied default: contains, supports, refutes, references
- SR algorithm undefined → Applied default: SM-2
- Graph viz library undefined → Applied default: React Flow
- AI provider undefined → Applied default: OpenAI GPT-4o
- Integration interfaces undefined → Added Foundation Sprint to define contracts

**Guardrails Applied**:
- NO custom block types in MVP
- NO weighted/annotated edges in MVP  
- NO group/team permissions in MVP
- NO offline support in MVP
- NO AI conversation/chat (single-turn suggestions only)
- NO comments/annotations in MVP
- NO export features in MVP
- ALL state in Convex, NEVER Next.js server memory

---

## Work Objectives

### Core Objective
Build the complete Coscientist knowledge system: a block-based collaborative editor with typed relationships, verification workflows, and AI assistance.

### Concrete Deliverables
1. **Convex Backend**: Schema + functions for blocks, edges, collaboration, presence, permissions
2. **Block Editor**: ProseMirror-based editor with block type support
3. **Graph View**: Visual representation of Dialectical Graph (React Flow)
4. **Sliding Panes Explorer**: Navigate knowledge graph with context preservation
5. **Verification Queue**: Spaced repetition interface for claim verification
6. **AI Assistant**: Edge suggestions, counterevidence search
7. **Search**: Full-text search across blocks
8. **Dashboard**: Home page with inbox, activity, verification queue

### Definition of Done
- [ ] All test suites pass: `bun test` exits 0
- [ ] Build succeeds: `bun run build` exits 0
- [ ] TypeScript clean: `bun run typecheck` exits 0
- [ ] Core user journey works: Create block → Add edge → View graph → Verify claim
- [ ] Collaboration works: Two users edit same block in real-time
- [ ] AI features work: Request edge suggestion, receive response

### Must Have
- Convex schema matching ADRs 1-7
- Real-time collaborative editing with ProseMirror
- Typed edges between blocks (contains, supports, refutes, references)
- Block-level permissions (owner, readers, writers, public)
- Presence indicators (who's online, who's editing where)
- Verification queue with SM-2 spaced repetition
- AI edge suggestions (single-turn, OpenAI GPT-4o)
- Graph visualization (React Flow)
- Full-text search
- TDD test coverage for all features

### Must NOT Have (Guardrails)
- Custom block types beyond (text, heading, list, document)
- Edge types beyond (contains, supports, refutes, references)
- Offline/local-first support
- Team/group permissions
- Comments or annotations
- Export features
- AI chat/conversation (only single-turn suggestions)
- Custom spaced repetition intervals
- State stored in Next.js server memory
- Separate WebSocket server (use Convex)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (needs setup)
- **User wants tests**: TDD
- **Framework**: vitest (Bun-compatible)

### Test Infrastructure Setup Task
- [ ] 0. Setup Test Infrastructure
  - Install: `bun add -d vitest @testing-library/react @testing-library/user-event jsdom`
  - Config: Create `vitest.config.ts` with jsdom environment
  - Verify: `bun test --help` → shows help
  - Example: Create `src/__tests__/example.test.ts`
  - Verify: `bun test` → 1 test passes

### TDD Workflow
Each task follows RED-GREEN-REFACTOR:
1. **RED**: Write failing test first
2. **GREEN**: Implement minimum code to pass
3. **REFACTOR**: Clean up while keeping green

---

## Task Flow

```
                    ┌─────────────────────┐
                    │  0. Foundation      │
                    │  - Test infra       │
                    │  - Convex schema    │
                    │  - Shared types     │
                    └─────────┬───────────┘
                              │
          ┌───────────────────┼───────────────────┬───────────────────┐
          ▼                   ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Stream 1: PKM   │ │ Stream 2: Collab│ │ Stream 3: Verify│ │ Stream 4: AI    │
│ - Block editor  │ │ - ProseMirror   │ │ - SR algorithm  │ │ - Mastra setup  │
│ - Graph view    │ │ - Presence      │ │ - Queue UI      │ │ - Edge suggest  │
│ - Search        │ │ - Permissions   │ │ - Recall flow   │ │ - Counter-evid  │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │                   │
         └───────────────────┼───────────────────┼───────────────────┘
                             ▼
                    ┌─────────────────────┐
                    │  5. Integration     │
                    │  - E2E tests        │
                    │  - Polish           │
                    └─────────────────────┘
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| Foundation | 0.1-0.5 | Sequential - each depends on previous |
| Stream A | 1.1-1.5 | Block editor tasks (can parallel after foundation) |
| Stream B | 2.1-2.4 | Collaboration tasks (can parallel after foundation) |
| Stream C | 3.1-3.4 | Verification tasks (can parallel after foundation) |
| Stream D | 4.1-4.3 | AI tasks (can parallel after foundation) |
| Integration | 5.1-5.3 | Sequential - depends on all streams |

| Task | Depends On | Reason |
|------|------------|--------|
| 1.x, 2.x, 3.x, 4.x | 0.5 | All streams need foundation complete |
| 5.x | 1.5, 2.4, 3.4, 4.3 | Integration needs all streams complete |

---

## TODOs

### Phase 0: Foundation (Sequential)

---

- [x] 0.1. Setup Test Infrastructure

  **What to do**:
  - Install vitest and testing utilities
  - Create vitest.config.ts with jsdom environment
  - Create example test to verify setup
  - Add test scripts to package.json

  **Must NOT do**:
  - Don't use Jest (use vitest for Bun compatibility)
  - Don't skip jsdom setup (needed for React component tests)

  **Parallelizable**: NO (first task)

  **References**:
  
  **Pattern References**:
  - `apps/web/package.json` - Existing scripts pattern
  - `apps/hq/content/docs/adr/008-platform-boundaries-expansion.mdx:220-230` - Dev workflow description
  
  **External References**:
  - Vitest docs: `https://vitest.dev/guide/`
  - Testing Library: `https://testing-library.com/docs/react-testing-library/intro`

  **Acceptance Criteria**:
  - [ ] `vitest.config.ts` exists at `apps/web/vitest.config.ts`
  - [ ] `package.json` has `"test": "vitest"` script
  - [ ] Example test at `apps/web/src/__tests__/example.test.ts`
  - [ ] `bun test` → PASS (1 test, 0 failures)

  **Commit**: YES
  - Message: `test: setup vitest infrastructure for TDD`
  - Files: `apps/web/vitest.config.ts`, `apps/web/package.json`, `apps/web/src/__tests__/example.test.ts`

---

- [x] 0.2. Initialize Convex Project

  **What to do**:
  - Run `bunx convex dev` to initialize Convex project
  - Create `.env.local` with Convex URL
  - Install `convex` package
  - Create basic `convex/` directory structure

  **Must NOT do**:
  - Don't commit actual Convex deployment URL (use .env.local.example)
  - Don't create schema yet (next task)

  **Parallelizable**: NO (depends on 0.1)

  **References**:
  
  **Pattern References**:
  - `apps/web/.env.local.example` - Environment variable pattern
  - `apps/hq/content/docs/adr/008-platform-boundaries-expansion.mdx:108-114` - Platform responsibilities
  
  **External References**:
  - Convex quickstart: `https://docs.convex.dev/quickstart/nextjs`

  **Acceptance Criteria**:
  - [ ] `convex/` directory exists with `_generated/` folder
  - [ ] `convex/convex.json` exists with project configuration
  - [ ] `.env.local.example` updated with `CONVEX_URL` placeholder
  - [ ] `bun run dev` starts without Convex errors

  **Commit**: YES
  - Message: `feat(convex): initialize convex project`
  - Files: `convex/`, `.env.local.example`, `package.json`

---

- [x] 0.3. Create Convex Schema (Blocks + Edges)

  **What to do**:
  - Create `convex/schema.ts` with blocks table (ADR 1)
  - Add edges table (ADR 4)
  - Add indexes for efficient queries
  - Define TypeScript types

  **Must NOT do**:
  - Don't add block types beyond: text, heading, list, document
  - Don't add edge types beyond: contains, supports, refutes, references
  - Don't add weighted edges or annotations

  **Parallelizable**: NO (depends on 0.2)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/001-unified-block-model.mdx:15-21` - Block schema specification
  - `apps/hq/content/docs/adr/004-edge-types-dialectical-graph.mdx:25-31` - Edge schema specification
  
  **API/Type References**:
  - `apps/hq/content/docs/adr/001-unified-block-model.mdx:17-21` - Block fields: id, type, content, createdBy, createdAt, updatedAt
  - `apps/hq/content/docs/adr/004-edge-types-dialectical-graph.mdx:26-31` - Edge fields: id, from, to, type, createdBy, createdAt

  **Acceptance Criteria**:
  - [ ] `convex/schema.ts` exports `blocks` table with fields: id, type, content, createdBy, createdAt, updatedAt, parentId?, access
  - [ ] `convex/schema.ts` exports `edges` table with fields: id, from, to, type, createdBy, createdAt
  - [ ] Block type enum: `"text" | "heading" | "list" | "document"`
  - [ ] Edge type enum: `"contains" | "supports" | "refutes" | "references"`
  - [ ] Index on `edges.from` and `edges.to` for graph traversal
  - [ ] `bunx convex dev` syncs schema without errors

  **Commit**: YES
  - Message: `feat(convex): add blocks and edges schema per ADR 1 & 4`
  - Files: `convex/schema.ts`

---

- [x] 0.4. Add Collaboration Schema (Steps, Snapshots, Presence)

  **What to do**:
  - Add `steps` table for ProseMirror OT (ADR 2)
  - Add `snapshots` table for checkpoints (ADR 2)
  - Add `presence` table for real-time awareness (ADR 7)
  - Add indexes for efficient queries

  **Must NOT do**:
  - Don't implement functions yet (schema only)
  - Don't add offline-related fields

  **Parallelizable**: NO (depends on 0.3)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/002-versioning-strategy.mdx:27-34` - Steps table schema
  - `apps/hq/content/docs/adr/002-versioning-strategy.mdx:39-45` - Snapshots table schema
  - `apps/hq/content/docs/adr/007-presence-cursors.mdx:29-37` - Presence table schema

  **Acceptance Criteria**:
  - [ ] `steps` table: documentId, stepData, version, clientId, timestamp
  - [ ] `snapshots` table: documentId, version, contentState, timestamp
  - [ ] `presence` table: userId, documentId, lastActive, cursorPos, status
  - [ ] Index on `steps.documentId` + `steps.version`
  - [ ] Index on `presence.documentId`
  - [ ] `bunx convex dev` syncs without errors

  **Commit**: YES
  - Message: `feat(convex): add collaboration schema per ADR 2 & 7`
  - Files: `convex/schema.ts`

---

- [x] 0.5. Add Permissions Schema + Shared Types

  **What to do**:
  - Update blocks table with ACL fields (ADR 6)
  - Create `convex/types.ts` with shared TypeScript types
  - Create `apps/web/src/lib/convex-types.ts` for frontend types
  - Export enums for block types and edge types

  **Must NOT do**:
  - Don't add team/group permissions
  - Don't add role-based permissions (owner/reader/writer only)

  **Parallelizable**: NO (depends on 0.4)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/006-permissions-embargo-model.mdx:27-34` - ACL structure
  - `apps/web/src/lib/types.ts` - Existing type patterns

  **Acceptance Criteria**:
  - [ ] Blocks table has `access` field: `{ readers: string[], writers: string[], public: boolean, embargoUntil?: number }`
  - [ ] `convex/types.ts` exports `BlockType`, `EdgeType` enums
  - [ ] `apps/web/src/lib/convex-types.ts` re-exports types for frontend
  - [ ] TypeScript compiles without errors

  **Commit**: YES
  - Message: `feat(convex): add permissions schema and shared types per ADR 6`
  - Files: `convex/schema.ts`, `convex/types.ts`, `apps/web/src/lib/convex-types.ts`

---

### Phase 1: Personal Knowledge Base (Parallel Stream A)

---

- [ ] 1.1. Create Block CRUD Functions

  **What to do**:
  - Create `convex/blocks.ts` with query and mutation functions
  - Implement: createBlock, getBlock, updateBlock, deleteBlock
  - Implement: getBlocksByParent, getBlocksByType
  - Add permission checks to all functions

  **Must NOT do**:
  - Don't implement ProseMirror-specific logic (Stream B)
  - Don't skip permission checks

  **Parallelizable**: YES (with 2.1, 3.1, 4.1 after 0.5)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/001-unified-block-model.mdx:91` - Uniform API pattern (getBlock, updateBlock)
  - `apps/hq/content/docs/adr/006-permissions-embargo-model.mdx:40-63` - Access control rules
  
  **External References**:
  - Convex functions: `https://docs.convex.dev/functions`

  **Acceptance Criteria**:
  - [ ] RED: Test file `convex/__tests__/blocks.test.ts` with failing tests
  - [ ] GREEN: `createBlock` mutation creates block with correct fields
  - [ ] GREEN: `getBlock` query returns block if user has read access, null otherwise
  - [ ] GREEN: `updateBlock` mutation updates if user has write access, throws otherwise
  - [ ] GREEN: `deleteBlock` mutation deletes block and cascades to edges
  - [ ] `bun test convex/__tests__/blocks.test.ts` → PASS

  **Commit**: YES
  - Message: `feat(convex): add block CRUD functions with permission checks`
  - Files: `convex/blocks.ts`, `convex/__tests__/blocks.test.ts`

---

- [ ] 1.2. Create Edge CRUD Functions

  **What to do**:
  - Create `convex/edges.ts` with query and mutation functions
  - Implement: createEdge, deleteEdge
  - Implement: getEdgesFrom, getEdgesTo, getEdgesByType
  - Add permission checks (need read access to both blocks)
  - Validate edge type is in allowed enum

  **Must NOT do**:
  - Don't allow edge types outside enum
  - Don't allow edges to non-existent blocks

  **Parallelizable**: YES (with 1.1)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/004-edge-types-dialectical-graph.mdx:71-81` - API design (addEdge, removeEdge, getEdgesFrom, getEdgesTo)
  - `apps/hq/content/docs/adr/004-edge-types-dialectical-graph.mdx:136-138` - Integrity constraints

  **Acceptance Criteria**:
  - [ ] RED: Test file `convex/__tests__/edges.test.ts` with failing tests
  - [ ] GREEN: `createEdge` validates both blocks exist and user has access
  - [ ] GREEN: `createEdge` validates edge type is in allowed enum
  - [ ] GREEN: `getEdgesFrom(blockId)` returns all outgoing edges
  - [ ] GREEN: `getEdgesTo(blockId)` returns all incoming edges (backlinks)
  - [ ] GREEN: Deleting a block cascades to delete all connected edges
  - [ ] `bun test convex/__tests__/edges.test.ts` → PASS

  **Commit**: YES
  - Message: `feat(convex): add edge CRUD functions with validation`
  - Files: `convex/edges.ts`, `convex/__tests__/edges.test.ts`

---

- [ ] 1.3. Create Block Editor Component

  **What to do**:
  - Create `apps/web/src/components/editor/block-editor.tsx`
  - Integrate with Convex for block persistence
  - Support block types: text, heading, list
  - Handle block creation, editing, deletion
  - Style with existing design tokens

  **Must NOT do**:
  - Don't implement real-time collaboration yet (Stream B)
  - Don't add block types beyond MVP list
  - Don't implement drag-and-drop reordering

  **Parallelizable**: YES (with 1.2)

  **References**:
  
  **Pattern References**:
  - `apps/web/src/components/note-content.tsx` - Existing content rendering pattern
  - `apps/web/src/lib/animations.ts` - Animation patterns
  - `AGENTS.md:Typography` - Typography design tokens
  
  **External References**:
  - Convex React: `https://docs.convex.dev/client/react`

  **Acceptance Criteria**:
  - [ ] RED: Test file with failing component tests
  - [ ] GREEN: Component renders block content based on type
  - [ ] GREEN: User can create new blocks (text, heading, list)
  - [ ] GREEN: User can edit block content inline
  - [ ] GREEN: User can delete blocks
  - [ ] GREEN: Changes persist to Convex
  - [ ] Uses existing typography tokens from `AGENTS.md`
  - [ ] `bun test` → PASS

  **Commit**: YES
  - Message: `feat(editor): add block editor component with Convex integration`
  - Files: `apps/web/src/components/editor/block-editor.tsx`, `apps/web/src/components/editor/__tests__/`

---

- [ ] 1.4. Create Graph Visualization Component

  **What to do**:
  - Install React Flow: `bun add reactflow`
  - Create `apps/web/src/components/graph/knowledge-graph.tsx`
  - Render blocks as nodes, edges as connections
  - Color-code by block type and edge type
  - Implement click-to-navigate (opens in sliding panes)

  **Must NOT do**:
  - Don't implement advanced interactions (pan, zoom controls exposed but no custom logic)
  - Don't implement clustering or layout algorithms
  - Don't implement minimap (post-MVP)

  **Parallelizable**: YES (with 1.3)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/004-edge-types-dialectical-graph.mdx:36-44` - Edge relationship visualization
  - `apps/web/src/lib/types.ts` - Type patterns
  
  **External References**:
  - React Flow: `https://reactflow.dev/docs/quickstart/`

  **Acceptance Criteria**:
  - [ ] RED: Test file with failing component tests
  - [ ] GREEN: Component fetches blocks and edges from Convex
  - [ ] GREEN: Blocks render as nodes with type-based styling
  - [ ] GREEN: Edges render with color-coding by type (supports=green, refutes=red, etc.)
  - [ ] GREEN: Click node → navigates to block in sliding panes
  - [ ] GREEN: Basic pan and zoom work
  - [ ] `bun test` → PASS

  **Commit**: YES
  - Message: `feat(graph): add knowledge graph visualization with React Flow`
  - Files: `apps/web/src/components/graph/knowledge-graph.tsx`, `package.json`

---

- [ ] 1.5. Create Workspace Pages + Search

  **What to do**:
  - Create `/workspace` dashboard page
  - Create `/workspace/[id]` document view with editor
  - Create `/workspace/[id]/graph` graph view
  - Create `/search` page with full-text search
  - Wire up navigation between views

  **Must NOT do**:
  - Don't implement semantic search (full-text only)
  - Don't implement advanced filters

  **Parallelizable**: YES (with 1.4)

  **References**:
  
  **Pattern References**:
  - `apps/web/src/app/[locale]/manifesto/[[...slug]]/page.tsx` - Page structure pattern
  - `apps/web/src/components/client/pane-orchestrator.tsx` - Pane navigation pattern
  - `apps/web/src/i18n/routing.ts` - i18n routing pattern

  **Acceptance Criteria**:
  - [ ] `/workspace` page lists user's documents
  - [ ] `/workspace/[id]` shows block editor for document
  - [ ] `/workspace/[id]/graph` shows graph visualization
  - [ ] `/search` has input field and shows results
  - [ ] Search finds blocks by title and content
  - [ ] Navigation between pages works with locale prefix
  - [ ] `bun run build` → PASS

  **Commit**: YES
  - Message: `feat(workspace): add workspace pages and search`
  - Files: `apps/web/src/app/[locale]/workspace/`, `apps/web/src/app/[locale]/search/`

---

### Phase 2: Collaboration (Parallel Stream B)

---

- [ ] 2.1. Integrate ProseMirror Sync Component

  **What to do**:
  - Install `@convex-dev/prosemirror-sync`
  - Configure component in `convex/` directory
  - Create `convex/prosemirror.ts` with sync functions
  - Test basic document creation and editing

  **Must NOT do**:
  - Don't implement custom OT logic (use component)
  - Don't implement CRDT (use OT per ADR 3)

  **Parallelizable**: YES (with 1.1, 3.1, 4.1 after 0.5)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/003-collaboration-protocol.mdx:90-96` - Backend integration description
  - `apps/hq/content/docs/adr/002-versioning-strategy.mdx:83` - prosemirror-sync component reference
  
  **External References**:
  - Convex ProseMirror Sync: `https://github.com/get-convex/convex-helpers/tree/main/packages/convex-prosemirror-sync`

  **Acceptance Criteria**:
  - [ ] `@convex-dev/prosemirror-sync` installed
  - [ ] Component configured in `convex/prosemirror.ts`
  - [ ] `submitSteps` function works
  - [ ] `getSteps` function works
  - [ ] `saveSnapshot` function works
  - [ ] `bunx convex dev` syncs without errors

  **Commit**: YES
  - Message: `feat(collab): integrate prosemirror-sync component`
  - Files: `convex/prosemirror.ts`, `package.json`

---

- [ ] 2.2. Create Collaborative Editor Component

  **What to do**:
  - Create `apps/web/src/components/editor/collaborative-editor.tsx`
  - Integrate ProseMirror with Convex sync
  - Handle step submission and conflict resolution
  - Show connection status indicator

  **Must NOT do**:
  - Don't show cursors yet (next task)
  - Don't implement offline support

  **Parallelizable**: YES (with 2.1)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/003-collaboration-protocol.mdx:34-40` - Collaboration flow
  - `AGENTS.md:Convex (Backend & Realtime)` - ProseMirror integration pattern
  
  **External References**:
  - ProseMirror basics: `https://prosemirror.net/docs/guide/`

  **Acceptance Criteria**:
  - [ ] RED: Test with mock Convex for component behavior
  - [ ] GREEN: Editor connects to Convex sync
  - [ ] GREEN: Local changes submit as steps
  - [ ] GREEN: Remote changes apply to local state
  - [ ] GREEN: Connection status shows (connected/disconnected)
  - [ ] Two browser tabs editing same doc see each other's changes
  - [ ] `bun test` → PASS

  **Commit**: YES
  - Message: `feat(collab): add collaborative editor with ProseMirror sync`
  - Files: `apps/web/src/components/editor/collaborative-editor.tsx`

---

- [ ] 2.3. Implement Presence System

  **What to do**:
  - Create `convex/presence.ts` with presence functions
  - Implement: updatePresence, getPresence, leaveDocument
  - Create `apps/web/src/hooks/use-presence.ts` hook
  - Create presence indicator UI component

  **Must NOT do**:
  - Don't show precise cursor positions (block-level only)
  - Don't implement typing indicators (post-MVP)

  **Parallelizable**: YES (with 2.2)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/007-presence-cursors.mdx:41-67` - Core mechanisms
  - `apps/hq/content/docs/adr/007-presence-cursors.mdx:69-74` - Frontend display requirements

  **Acceptance Criteria**:
  - [ ] RED: Test presence functions
  - [ ] GREEN: `updatePresence` creates/updates presence record
  - [ ] GREEN: `getPresence` returns active users (within 10s heartbeat)
  - [ ] GREEN: `leaveDocument` removes presence record
  - [ ] GREEN: `usePresence` hook provides reactive presence data
  - [ ] GREEN: Facepile component shows user avatars
  - [ ] Users see each other in presence list
  - [ ] `bun test` → PASS

  **Commit**: YES
  - Message: `feat(collab): add presence system with facepile UI`
  - Files: `convex/presence.ts`, `apps/web/src/hooks/use-presence.ts`, `apps/web/src/components/presence/`

---

- [ ] 2.4. Implement Permission Functions

  **What to do**:
  - Create `convex/permissions.ts` with sharing functions
  - Implement: shareBlock, unshareBlock, setPublic, setEmbargo
  - Create share dialog UI component
  - Integrate with Clerk user lookup

  **Must NOT do**:
  - Don't implement team/group sharing
  - Don't implement roles beyond owner/reader/writer

  **Parallelizable**: YES (with 2.3)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/006-permissions-embargo-model.mdx:82-87` - Implementation details
  - `apps/web/src/components/layout/app-header.tsx` - Clerk integration pattern

  **Acceptance Criteria**:
  - [ ] RED: Test permission functions
  - [ ] GREEN: `shareBlock(blockId, userId)` adds user to readers
  - [ ] GREEN: `shareBlock(blockId, userId, "write")` adds user to writers
  - [ ] GREEN: `setPublic(blockId, true)` makes block public
  - [ ] GREEN: `setEmbargo(blockId, timestamp)` sets embargo time
  - [ ] GREEN: Share dialog shows Clerk user search
  - [ ] GREEN: Embargoed blocks hidden until time passes
  - [ ] `bun test` → PASS

  **Commit**: YES
  - Message: `feat(collab): add permission and sharing functions`
  - Files: `convex/permissions.ts`, `apps/web/src/components/share/`

---

### Phase 3: Verification System (Parallel Stream C)

---

- [ ] 3.1. Implement SM-2 Algorithm

  **What to do**:
  - Create `apps/web/src/lib/spaced-repetition/sm2.ts`
  - Implement SM-2 algorithm for interval calculation
  - Create types for review state (easiness, interval, repetitions)
  - Add comprehensive tests

  **Must NOT do**:
  - Don't implement custom intervals (use standard SM-2)
  - Don't implement FSRS or other algorithms

  **Parallelizable**: YES (with 1.1, 2.1, 4.1 after 0.5)

  **References**:
  
  **External References**:
  - SM-2 algorithm: `https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method`

  **Acceptance Criteria**:
  - [ ] RED: Test file with SM-2 calculation tests
  - [ ] GREEN: `calculateNextReview(quality, state)` returns correct interval
  - [ ] GREEN: Quality 0-2 resets repetitions
  - [ ] GREEN: Quality 3-5 increases interval based on easiness
  - [ ] GREEN: Easiness factor never drops below 1.3
  - [ ] `bun test apps/web/src/lib/spaced-repetition` → PASS

  **Commit**: YES
  - Message: `feat(verify): implement SM-2 spaced repetition algorithm`
  - Files: `apps/web/src/lib/spaced-repetition/sm2.ts`, `apps/web/src/lib/spaced-repetition/__tests__/`

---

- [ ] 3.2. Add Verification Schema + Functions

  **What to do**:
  - Add `reviews` table to Convex schema
  - Create `convex/verification.ts` with review functions
  - Implement: markForReview, submitReview, getDueReviews
  - Link reviews to blocks

  **Must NOT do**:
  - Don't add gamification fields
  - Don't add analytics/stats fields

  **Parallelizable**: YES (with 3.1)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/001-unified-block-model.mdx` - Block reference pattern
  - `README.md:Learning Science Integration` - Verification concepts

  **Acceptance Criteria**:
  - [ ] `reviews` table: blockId, userId, nextReview, easiness, interval, repetitions
  - [ ] `markForReview(blockId)` creates review record
  - [ ] `submitReview(reviewId, quality)` updates using SM-2
  - [ ] `getDueReviews(userId)` returns reviews where nextReview <= now
  - [ ] `bunx convex dev` syncs without errors
  - [ ] `bun test convex/__tests__/verification.test.ts` → PASS

  **Commit**: YES
  - Message: `feat(verify): add verification schema and functions`
  - Files: `convex/schema.ts`, `convex/verification.ts`

---

- [ ] 3.3. Create Verification Queue UI

  **What to do**:
  - Create `/verify` page
  - Create verification card component (shows claim without evidence)
  - Create reveal + grading UI (show evidence, rate 1-5)
  - Show verification statistics

  **Must NOT do**:
  - Don't implement gamification
  - Don't implement streaks or achievements

  **Parallelizable**: YES (with 3.2)

  **References**:
  
  **Pattern References**:
  - `apps/web/src/components/pane/note-pane.tsx` - Card-like content pattern
  - `apps/web/src/lib/animations.ts` - Animation patterns for reveal

  **Acceptance Criteria**:
  - [ ] `/verify` page shows due reviews count
  - [ ] Verification card shows claim text only
  - [ ] "Reveal" button shows supporting evidence
  - [ ] Rating buttons (1-5) submit review
  - [ ] After rating, shows next card or "All done"
  - [ ] Statistics show: due today, completed today, streak (basic)
  - [ ] `bun run build` → PASS

  **Commit**: YES
  - Message: `feat(verify): add verification queue page and UI`
  - Files: `apps/web/src/app/[locale]/verify/`, `apps/web/src/components/verify/`

---

- [ ] 3.4. Implement Rebuttal Search Action

  **What to do**:
  - Create `convex/actions/rebuttal.ts` as Convex action
  - Query Convex for blocks with `refutes` edges
  - Surface related counterevidence
  - Add "Find counterevidence" button to verification UI

  **Must NOT do**:
  - Don't use external AI for search (Stream D)
  - Don't implement semantic search

  **Parallelizable**: YES (with 3.3)

  **References**:
  
  **Pattern References**:
  - `apps/hq/content/docs/adr/004-edge-types-dialectical-graph.mdx:57-60` - Refutes edge type
  - `README.md:Adversarial-by-Default Exploration` - Rebuttal-first search concept

  **Acceptance Criteria**:
  - [ ] `findCounterEvidence(blockId)` returns blocks with refutes edges
  - [ ] Also returns blocks with conflicting claims (same topic)
  - [ ] Verification UI shows "Find counterevidence" button
  - [ ] Results shown in collapsible panel
  - [ ] `bun test` → PASS

  **Commit**: YES
  - Message: `feat(verify): add rebuttal search for counterevidence`
  - Files: `convex/actions/rebuttal.ts`, `apps/web/src/components/verify/`

---

### Phase 4: AI Integration (Parallel Stream D)

---

- [ ] 4.1. Setup Mastra Framework

  **What to do**:
  - Install Mastra: `bun add @mastra/core`
  - Create `apps/web/src/mastra/index.ts` configuration
  - Configure OpenAI provider
  - Create basic agent definition

  **Must NOT do**:
  - Don't add multiple AI providers (OpenAI only)
  - Don't implement conversation/chat

  **Parallelizable**: YES (with 1.1, 2.1, 3.1 after 0.5)

  **References**:
  
  **Pattern References**:
  - `AGENTS.md:Mastra (AI Agent System)` - Mastra configuration pattern
  
  **External References**:
  - Mastra docs: `https://mastra.ai/docs`

  **Acceptance Criteria**:
  - [ ] `@mastra/core` installed
  - [ ] `apps/web/src/mastra/index.ts` exports configured Mastra instance
  - [ ] OpenAI provider configured with env variable
  - [ ] Basic agent responds to test prompt
  - [ ] `.env.local.example` updated with `OPENAI_API_KEY`

  **Commit**: YES
  - Message: `feat(ai): setup Mastra framework with OpenAI`
  - Files: `apps/web/src/mastra/`, `package.json`, `.env.local.example`

---

- [ ] 4.2. Create Edge Suggestion Tool

  **What to do**:
  - Create `apps/web/src/mastra/tools/suggest-edges.ts`
  - Implement tool that analyzes two blocks and suggests edge type
  - Create Convex action to invoke tool
  - Add "Suggest relationship" button to editor

  **Must NOT do**:
  - Don't auto-create edges (suggestions only)
  - Don't implement multi-turn conversation

  **Parallelizable**: YES (with 4.1)

  **References**:
  
  **Pattern References**:
  - `AGENTS.md:Tool Definition` - Mastra tool pattern
  - `apps/hq/content/docs/adr/004-edge-types-dialectical-graph.mdx:175-179` - AI-driven edge creation concept

  **Acceptance Criteria**:
  - [ ] Tool accepts two block IDs
  - [ ] Tool returns suggested edge type with confidence
  - [ ] Tool returns reasoning for suggestion
  - [ ] Editor shows "Suggest relationship" button
  - [ ] UI shows suggestion with accept/reject buttons
  - [ ] `bun test` → PASS

  **Commit**: YES
  - Message: `feat(ai): add edge suggestion tool with Mastra`
  - Files: `apps/web/src/mastra/tools/suggest-edges.ts`, `convex/actions/ai.ts`

---

- [ ] 4.3. Create Counterevidence Search Tool

  **What to do**:
  - Create `apps/web/src/mastra/tools/find-counterevidence.ts`
  - Implement tool that searches for counterarguments to a claim
  - Integrate with block content analysis
  - Add to verification UI

  **Must NOT do**:
  - Don't implement external web search
  - Don't implement RAG (use existing blocks only)

  **Parallelizable**: YES (with 4.2)

  **References**:
  
  **Pattern References**:
  - `README.md:Adversarial-by-Default Exploration` - Counterexample-first search concept
  - `apps/hq/content/docs/adr/004-edge-types-dialectical-graph.mdx:57-60` - Refutes edge type

  **Acceptance Criteria**:
  - [ ] Tool accepts block ID (claim)
  - [ ] Tool analyzes claim content
  - [ ] Tool searches existing blocks for potential contradictions
  - [ ] Returns ranked list of potential counterevidence
  - [ ] Integrates with verification queue UI
  - [ ] `bun test` → PASS

  **Commit**: YES
  - Message: `feat(ai): add counterevidence search tool`
  - Files: `apps/web/src/mastra/tools/find-counterevidence.ts`

---

### Phase 5: Integration (Sequential)

---

- [ ] 5.1. End-to-End Integration Testing

  **What to do**:
  - Create E2E test suite with Playwright
  - Test core user journey: Create → Edit → Link → Verify
  - Test collaboration: Two users editing
  - Test AI features: Edge suggestion

  **Must NOT do**:
  - Don't test edge cases exhaustively (coverage, not completeness)

  **Parallelizable**: NO (depends on all streams)

  **References**:
  
  **Pattern References**:
  - `AGENTS.md:playwright` - Playwright skill reference
  
  **External References**:
  - Playwright: `https://playwright.dev/docs/intro`

  **Acceptance Criteria**:
  - [ ] E2E test: User creates block, adds edge, views graph
  - [ ] E2E test: Two users collaborate on same document
  - [ ] E2E test: User verifies claim with spaced repetition
  - [ ] E2E test: AI suggests edge relationship
  - [ ] All E2E tests pass: `bun run test:e2e` → PASS

  **Commit**: YES
  - Message: `test(e2e): add integration tests for core journeys`
  - Files: `apps/web/e2e/`

---

- [ ] 5.2. Dashboard Integration

  **What to do**:
  - Complete `/workspace` dashboard with all sections
  - Add inbox (pending items)
  - Add verification due count
  - Add recent activity feed
  - Add quick capture

  **Must NOT do**:
  - Don't add analytics or charts

  **Parallelizable**: NO (depends on 5.1)

  **References**:
  
  **Pattern References**:
  - `apps/web/src/app/[locale]/page.tsx` - Landing page structure
  - `apps/web/src/components/landing/` - Card/section patterns

  **Acceptance Criteria**:
  - [ ] Dashboard shows inbox with pending items
  - [ ] Dashboard shows verification due count with link
  - [ ] Dashboard shows recent activity (last 10 items)
  - [ ] Quick capture creates new block
  - [ ] All sections fetch from Convex correctly
  - [ ] `bun run build` → PASS

  **Commit**: YES
  - Message: `feat(workspace): complete dashboard integration`
  - Files: `apps/web/src/app/[locale]/workspace/page.tsx`

---

- [ ] 5.3. Polish and Accessibility

  **What to do**:
  - Audit all new components for accessibility
  - Add aria-labels to all interactive elements
  - Test keyboard navigation
  - Test reduced motion preferences
  - Fix any visual polish issues

  **Must NOT do**:
  - Don't add new features
  - Don't refactor working code

  **Parallelizable**: NO (depends on 5.2)

  **References**:
  
  **Pattern References**:
  - `AGENTS.md:Accessibility` - Accessibility requirements
  - `apps/web/src/hooks/use-reduced-motion.ts` - Reduced motion pattern

  **Acceptance Criteria**:
  - [ ] All buttons have aria-labels
  - [ ] All forms have proper labels
  - [ ] Keyboard navigation works (Tab, Enter, Escape)
  - [ ] Reduced motion respected in all animations
  - [ ] No accessibility violations in axe audit
  - [ ] `bun run build` → PASS

  **Commit**: YES
  - Message: `fix(a11y): accessibility audit and polish`
  - Files: Various component files

---

## Commit Strategy

| After Task | Message | Key Files |
|------------|---------|-----------|
| 0.1 | `test: setup vitest infrastructure` | vitest.config.ts |
| 0.2 | `feat(convex): initialize project` | convex/ |
| 0.3 | `feat(convex): blocks and edges schema` | schema.ts |
| 0.4 | `feat(convex): collaboration schema` | schema.ts |
| 0.5 | `feat(convex): permissions and types` | schema.ts, types.ts |
| 1.1-1.5 | `feat(pkm): ...` | convex/blocks.ts, components/editor/ |
| 2.1-2.4 | `feat(collab): ...` | convex/prosemirror.ts, components/presence/ |
| 3.1-3.4 | `feat(verify): ...` | lib/spaced-repetition/, components/verify/ |
| 4.1-4.3 | `feat(ai): ...` | mastra/, convex/actions/ai.ts |
| 5.1-5.3 | `test/feat/fix: ...` | e2e/, workspace/ |

---

## Success Criteria

### Verification Commands
```bash
# All tests pass
bun test

# TypeScript compiles
bun run typecheck

# Build succeeds
bun run build

# E2E tests pass
bun run test:e2e

# Convex syncs
bunx convex dev
```

### Final Checklist
- [ ] All "Must Have" features implemented
- [ ] All "Must NOT Have" guardrails respected
- [ ] All tests pass (unit + E2E)
- [ ] TypeScript compiles without errors
- [ ] Build succeeds
- [ ] Core user journey works end-to-end
- [ ] Collaboration works with 2+ users
- [ ] AI features respond correctly
