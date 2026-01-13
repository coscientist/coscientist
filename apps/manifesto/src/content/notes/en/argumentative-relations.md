---
title: Argumentative Relations
description: Edge types in a dialectical graph organized by function
---

Argumentative relations are the edge types in a [Dialectical Graph](./dialectical-graph) that encode how epistemic objects relate to each other. They are what distinguish a dialectical graph from a topic-similarity graph.

## Challenge Relations

- [Attack](./attack) — direct challenge to a claim's truth
- [Undercut](./undercut) — challenge to method, assumption, or definition
- [Counterexample](./counterexample) — a case that breaks the claim
- Contradicts — explicit incompatibility

## Support Relations

- Supports — evidence or reasoning that strengthens a claim
- Cites — explicit attribution to a [source](./source)
- Replicates / fails_to_replicate — replication status

## Refinement Relations

- Refines — narrows or clarifies a claim
- Generalizes / specializes — scope adjustments
- Depends_on — links claims to their [assumptions](./assumption)
- Defines — connects terms to [definitions](./definition-drift)

See [Dialectical Graph Edges](./dialectical-graph-edges) for full specification and [Relation Typing vs Similarity](./relation-typing-vs-similarity) for why typed edges matter.
