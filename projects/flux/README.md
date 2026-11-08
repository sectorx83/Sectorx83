# Flux Agent

**Status:** Phases 1 and 2 complete; Phase 3 in progress  
**Category:** AI / Developer tooling  
**Repository:** https://github.com/sectorx83/Flux-agent

Flux Agent is a local-first AI agent and automation CLI for conversation, planning, software development, and remote task execution.

## Completed

- Phase 1: task decomposition, approval-gated tools, browser automation, workflow retries and event triggers.
- Phase 2: optional semantic memory, official service integrations, capability-aware model routing, usage tracking, remote device pairing, and streamed task status.
- Phase 3 work already implemented: signed plugin packages/catalog, deployment status and rollback tooling, private local environment storage, cross-platform CI, package/release automation, and security regression tests.

## Remaining Phase 3 item

Generic GitHub Actions rollback is intentionally not claimed as complete because rollback behavior is workflow-specific. Provider deployments and real-account integration tests are not run in CI.

## Safety boundary

Flux uses approval gates and workspace checks, but it is not an operating-system sandbox. Tools run with the permissions of the launching user.
