# Cathedral

**Status:** Phases 1–3 complete; Phase 4 in progress  
**Category:** Infrastructure / Experiment laboratory  
**Repository:** https://github.com/sectorx83/Cathedral

Cathedral is an open computing laboratory for managing isolated software experiments, observing runtime behavior, diagnosing failures, and reproducing environments. It treats an experiment as a lifecycle with inspectable inputs, execution, output, and evidence.

## Design goals

- Make experiment environments explicit and repeatable.
- Keep execution and resource boundaries visible.
- Capture enough runtime evidence to diagnose failures.
- Compare snapshots and results rather than relying on memory.
- Provide a desktop interface without hiding the underlying runtime.

## Architecture

| Layer | Responsibility |
| --- | --- |
| Core | Rust engine, experiment lifecycle and manifest validation |
| Registry | SQLite metadata and managed workspaces |
| Runtime | Linux Bubblewrap isolation and resource controls |
| Inspection | Process information, logs and runtime metrics |
| Reproducibility | Snapshots, verification and comparison |
| Local interface | Desktop shell, authenticated local API and experiment controls |
| Live session | Server-sent telemetry, PTY input/output and resize controls |
| Filesystem | Path-confined, read-only browsing of captured experiment files |

## Delivery record

### Phase 1 — core foundations

Rust core, CLI, SQLite registry, experiment lifecycle, manifest validation, managed workspaces, and diagnostics.

### Phase 2 — isolated runtime

Linux Bubblewrap execution, process inspection, logs, resource controls, and runtime metrics.

### Phase 3 — reproducibility

Snapshot, verification, comparison, and reproducibility foundations.

### Phase 4 — desktop studio (in progress)

Desktop controls, local API, live run telemetry, PTY-backed Linux interaction, captured logs, filesystem inspection, snapshot comparison, and a permission-scoped extension registry.

## Current boundaries

Linux is the supported workload-isolation target. Windows and macOS isolation are not claimed. Real sandbox and PTY execution, broader advanced experiments, and installer upgrade verification continue to require validation.

## Next engineering focus

Validate the desktop control path against real isolated workloads, strengthen lifecycle and failure reporting, and keep the local API's permissions aligned with the runtime's actual capabilities.
