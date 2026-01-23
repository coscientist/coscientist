/**
 * ProseMirror Sync Integration (ADR 2 & 3)
 *
 * Exposes the Convex ProseMirror Sync component API for collaborative editing.
 * Uses Operational Transformation (OT) for conflict resolution.
 *
 * Functions:
 * - submitSteps: Client submits editing steps
 * - getSteps: Client fetches steps since a version
 * - saveSnapshot: Periodic full-state checkpoint
 * - getSnapshot: Client fetches latest snapshot
 * - latestVersion: Get current document version
 */

import { ProsemirrorSync } from "@convex-dev/prosemirror-sync"
import { components } from "./_generated/api"

const prosemirrorSync = new ProsemirrorSync(components.prosemirrorSync)

/**
 * Export the sync API functions
 *
 * These are the core functions for collaborative editing:
 * - submitSteps: Submit editing operations from client
 * - getSteps: Fetch steps for rebasing local changes
 * - saveSnapshot: Store periodic checkpoints
 * - getSnapshot: Fetch latest document state
 * - latestVersion: Get current version number
 */
export const {
  getSnapshot,
  submitSnapshot,
  latestVersion,
  getSteps,
  submitSteps,
} = prosemirrorSync.syncApi({
  // Authorization hooks can be added here if needed
  // For now, using default behavior (all authenticated users can read/write)
})
