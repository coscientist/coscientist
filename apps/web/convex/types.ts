/**
 * Shared TypeScript types for Convex backend
 * Exported for use in both server and client code
 */

/**
 * Block Types (ADR 1: Unified Block Model)
 * All content is represented as blocks - the atomic unit of knowledge
 */
export enum BlockType {
  Text = "text",
  Heading = "heading",
  List = "list",
  Document = "document",
}

/**
 * Edge Types (ADR 4: Edge Types and Dialectical Graph)
 * Typed relationships between blocks forming a directed knowledge graph
 */
export enum EdgeType {
  Contains = "contains", // Structural: document contains block
  Supports = "supports", // Dialectical: evidence supports claim
  Refutes = "refutes", // Dialectical: block refutes another
  References = "references", // Reference: block references another
}

/**
 * Access Control List (ADR 6: Permissions and Embargo Model)
 * Block-level permissions with optional time-based embargo
 */
export interface BlockAccess {
  readers: string[] // User IDs who can read
  writers: string[] // User IDs who can write
  public: boolean // Viewable by anyone
  embargoUntil?: number // Time lock (timestamp in ms)
}
