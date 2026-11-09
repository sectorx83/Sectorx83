# Flux Agent

**Status:** Core platform complete  
**Category:** AI / Developer tooling  
**Repository:** https://github.com/sectorx83/Flux-agent

Flux Agent is a local-first AI agent and automation CLI for conversation, planning, software development, and remote task execution.

## Completed capabilities

- Chat, Plan, and approval-gated Build modes with bounded specialist-agent delegation.
- Groq as the default provider, with optional Gemini, Cerebras, and OpenRouter routing.
- Browser automation with explicit approval for navigation and interactions.
- Workflow retries, event triggers, and authenticated remote workflow events.
- Optional local semantic memory and SQLite-backed project notes.
- GitHub, Slack, Discord, Telegram, Google Tasks, and Notion task integrations.
- Capability-aware model routing, usage tracking, and remote device pairing.
- Signed plugin packages and catalog, deployment inspection, approval-gated Vercel and Docker Swarm rollback, private local environment storage, cross-platform CI, and release automation.

## Documented limits

Generic GitHub Actions rollback is not claimed because rollback behavior is workflow-specific. Provider deployments and real-account integration tests depend on external credentials and are not run in CI. Flux uses approval gates and workspace checks, but it is not an operating-system sandbox.
