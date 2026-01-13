---
title: Status Transition Rules
description: What triggers movement between claim states in a dialectical graph
---

Status transition rules define what moves a [claim](./claim) from one state to another in the [claim status taxonomy](./claim-status-taxonomy). Transitions depend on the type of challenge, not the count: a single decisive [counterexample](./counterexample) matters more than many unconvincing objections.

Key transitions include: tentative → contested (when an [attack](./attack) is registered), contested → conditionally supported (when the attack is answered by narrowing [scope](./scope) or clarifying [assumptions](./assumption)), conditionally supported → robust (when multiple independent paths confirm), robust → refuted (when a counterexample survives scrutiny), and any state → obsolete (when [definition drift](./definition-drift) severs the claim's meaning).

These rules are part of the [epistemic protocol layer](./epistemic-protocol-layer) in [Coscientist](./coscientist). They make knowledge updating explicit and auditable rather than implicit in prose.
