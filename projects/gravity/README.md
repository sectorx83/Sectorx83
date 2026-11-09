# Gravity

**Status:** Phase 2 complete; verified on `main`  
**Category:** Systems / Computational runtime  
**Repository:** https://github.com/sectorx83/Gravity

Gravity is an adaptive computational runtime designed to change the topology of a running computational graph while preserving accepted work, required state, and correctness.

## The central problem

A fixed graph can become a poor fit as a workload changes. Rewiring a live system is risky, though: messages may be in flight, cells may own state, and a failed migration must not leave the runtime half-mutated. Gravity treats adaptation as a controlled transaction instead of an informal graph edit.

## Runtime model

| Component | Responsibility |
| --- | --- |
| Graph | Deterministic directed message graph with bounded queues |
| Cell | Explicit lifecycle and transactional processing |
| Snapshot | Captures state needed for restoration |
| Mutation transaction | Prepares topology changes and work partitioning |
| State transfer | Moves required state into candidate cells |
| Shadow validation | Checks candidate behavior before cutover |
| Routing cutover | Switches accepted traffic only after validation |
| Rollback | Restores the prior valid topology when a candidate fails |

## Phase 1 — complete

- Rust workspace with a core runtime and CLI.
- Explicit cell lifecycle and failure handling.
- Deterministic directed message graph with bounded queues.
- Transactional cell processing and rollback on failure.
- In-memory snapshots and transactional restoration.
- Formatting, Clippy, workspace tests, documentation, and CLI demonstration.

## Phase 2 — complete

- Runtime topology mutation transactions and work partitioning contracts.
- Consistent cell snapshots and Morphological State Transfer.
- Shadow validation of candidate topology.
- Validated routing cutover, rollback, and cell regeneration.
- Measured adaptation and a live evolution demonstration.

The documented Phase 2 exit criteria are met on `main`: formatting, Clippy, workspace tests, documentation, the Phase 1 CLI demonstration, and the Phase 2 live evolution demonstration pass in CI.

## Current boundaries

The runtime remains single-threaded and in-memory. It does not claim distributed consensus, durable cross-process transactions, or automatic partitioning without an explicit workload partitioner. These are deliberate boundaries, not features to infer from the project name.

## Next research tracks

Concurrency, persistence, and distributed coordination should be introduced as separately validated phases. The current transactional model provides a base for those experiments, not proof that they already work.
