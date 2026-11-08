# Cathedral

**Status:** Phases 1–3 complete; Phase 4 in progress  
**Category:** Infrastructure / Experiment laboratory  
**Repository:** https://github.com/sectorx83/Cathedral

Cathedral is an open computing laboratory for managing isolated software experiments, observing runtime behavior, diagnosing failures, and reproducing environments.

## Completed phases

- Phase 1: Rust core, CLI, SQLite registry, experiment lifecycle, manifest validation, managed workspaces, and diagnostics.
- Phase 2: Linux Bubblewrap runtime, process inspection, logs, resource controls, and runtime metrics.
- Phase 3: snapshot, verification, comparison, and reproducibility foundations as described in the upstream roadmap.

## Phase 4 in progress

The desktop shell and local API include experiment controls, server-sent run telemetry, PTY-backed Linux input/output and resize controls, captured logs, a path-confined read-only filesystem browser, snapshot verification/comparison, and a permission-scoped extension registry.

## Known limits

Real sandbox and PTY execution, broader advanced experiments, and installer upgrade verification are still being validated. Windows and macOS workload isolation are not supported.
