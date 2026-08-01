# Architecture Decision Log

| ADR                                                                  | Status   | Date       | Title / Summary                                                                                                                         |
| -------------------------------------------------------------------- | -------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [ADR-00001](adrs/adr-00001-command-module-layout.md)                 | Accepted | 2026-05-10 | Command module layout — each CLI command workflow owns a directory; commands root keeps shared helpers only.                            |
| [ADR-00002](adrs/adr-00002-top-level-backtrail-workflow-commands.md) | Accepted | 2026-05-10 | Top-level Backtrail workflow commands — expose create, implement, and review as top-level commands and remove exec as public namespace. |
| [ADR-00003](adrs/adr-00003-backtrail-cli-config-file.md)             | Accepted | 2026-05-11 | Backtrail CLI config file — define default JSON config file, init output, startup loading, and shared `--config` CLI contract.          |
| [ADR-00004](adrs/adr-00004-timestamp-based-backtrail-artifact-ids.md) | Proposed | 2026-05-12 | Timestamp-based Backtrail artifact IDs — use timestamp-derived IDs for new Backtrail records to reduce index allocation conflicts. |
| [ADR-00005](adrs/adr-00005-conditional-reversibility-sections.md)     | Accepted | 2026-08-01 | Conditional reversibility sections — require rollback detail only for materially risky or difficult-to-reverse work.              |
