# Flux Agent

**Status:** Core platform complete  
**Category:** AI / Developer tooling  
**Repository:** https://github.com/sectorx83/Flux-agent

Flux Agent is a local-first AI agent and automation CLI for conversation, planning, software development, and remote task execution. It is designed around a simple distinction: an agent should be able to explain a plan, request permission for consequential actions, and leave an inspectable trail of what it did.

## Product model

Flux exposes Chat, Plan, and Build modes. Planning can be separated from execution, and tools that change a workspace or interact with external services are approval-gated. Specialist agents can be delegated bounded work rather than receiving unrestricted control of the whole task.

## Architecture

| Area | Responsibility |
| --- | --- |
| CLI | User interaction and operating modes |
| Model routing | Groq default with optional Gemini, Cerebras, and OpenRouter providers |
| Tool layer | Workspace checks, browser automation and approval gates |
| Memory | SQLite-backed notes and optional local semantic memory |
| Orchestration | Specialist agents, workflows, retries and event triggers |
| Remote layer | Device pairing, task streaming and authenticated workflow events |
| Integrations | GitHub, Slack, Discord, Telegram, Google Tasks and Notion |
| Operations | Signed plugin packages, catalog, deployment inspection and selected rollback adapters |

## Completed capabilities

- Chat, Plan, and approval-gated Build modes with bounded specialist-agent delegation.
- Multi-provider routing and fallback.
- Browser automation with explicit approval for navigation and interactions.
- Workflow retries, event triggers, and authenticated remote workflow events.
- Optional local semantic memory and SQLite-backed project notes.
- Capability-aware model routing, usage tracking, and remote device pairing.
- Signed plugin packages, deployment inspection, and approval-gated rollback for explicitly supported deployment targets.
- Cross-platform CI and release automation.

## Safety and operational boundaries

Flux uses approval gates and workspace checks, but it is not an operating-system sandbox. External provider and real-account integration tests depend on credentials and are not all run in CI. Generic GitHub Actions rollback is not claimed because rollback behavior is workflow-specific. Deployment rollback is limited to the targets for which a concrete adapter exists.

## Next engineering focus

Continue hardening provider failure handling, permission boundaries, integration tests, and operational observability. The aim is predictable automation, not autonomy theatre.
