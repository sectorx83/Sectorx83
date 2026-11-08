# Gravity

**Status:** Phase 1 complete; Phase 2 in progress  
**Category:** Systems / Computational runtime  
**Repository:** https://github.com/sectorx83/Gravity

Gravity is an adaptive computational runtime designed to change the topology of a running computational graph while preserving accepted work, required state, and correctness.

## Phase 1 complete

- Rust workspace with a core runtime and CLI.
- Explicit cell lifecycle and failure handling.
- Deterministic directed message graph with bounded queues.
- Transactional cell processing and rollback on failure.
- In-memory snapshots and transactional restoration.
- Formatting, Clippy, unit tests, documentation, and CLI demonstration in CI.

## Phase 2 in progress

The Evolution Engine targets topology mutation transactions, work partitioning contracts, consistent snapshots, Morphological State Transfer, shadow validation, atomic routing cutover, rollback, cell regeneration, and measured adaptation.

Phase 2 is not complete until the required demonstration is automated and repeatable, including injected failures during snapshot, migration, validation, and cutover.
