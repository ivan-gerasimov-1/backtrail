# FEATURE-00007: CLI list command

| Status   | Date       |
| -------- | ---------- |
| Proposed | 2026-05-13 |

## Context

Backtrail artifacts are stored across ADR, FEATURE, CHANGE, and TASK Markdown indexes and detail files. Users need one CLI entry point to see all currently defined artifacts without opening each Backtrail file separately.

## Goal

Provide a root `backtrail list` command that prints all defined Backtrail artifacts grouped by artifact type.

## Users / Use Cases

- CLI user: runs `backtrail list` to inspect ADR, FEATURE, CHANGE, and TASK records from one command.
- Maintainer: checks project Backtrail state before planning or implementation work.

## Scope

- Add a root CLI command named `list`.
- Read Backtrail Markdown files for ADR, FEATURE, CHANGE, and TASK artifact definitions.
- Print text output grouped by artifact type.
- Preserve content in a format similar to existing Markdown index rows.
- Separate output sections by type.

## Non-Goals

- No JSON, table-format option, filtering, sorting flags, or status filters in first implementation.
- No mutation of Backtrail artifacts.
- No validation or repair of malformed Backtrail files.
- No replacement for existing create, implement, or review workflows.

## Acceptance Criteria

- Given a project with `.backtrail/adl.md`, `.backtrail/features.md`, `.backtrail/changes.md`, and `.backtrail/tasks.md`, when user runs `backtrail list`, then CLI prints ADR, FEATURE, CHANGE, and TASK sections.
- Given artifact rows exist in those Markdown files, when user runs `backtrail list`, then each row appears under matching type with content equivalent to source index text.
- Given one artifact index file is absent or has no rows, when user runs `backtrail list`, then command still returns other artifact types and handles missing or empty type section without failing.
- Given command runs, when it completes successfully, then it does not create, edit, or delete Backtrail files.

## Dependencies

- Existing Backtrail Markdown index files: `.backtrail/adl.md`, `.backtrail/features.md`, `.backtrail/changes.md`, `.backtrail/tasks.md`.
- Existing CLI root command registration pattern.

## Risks / Rollback

Risk: Markdown table parsing may be brittle if index formats drift. First implementation should keep parser narrow, read-only, and easy to replace. Rollback is removing the root `list` command and its parser without data migration because command is read-only.
