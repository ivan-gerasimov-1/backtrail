# FEATURE-00001: CLI init command

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-06 |

## Context

The repository includes a CLI under `apps/cli/`, but there is no documented initialization workflow for setting up Backtrail files in a project. Users need one command that creates the `.backtrail` directory and required Backtrail index/files without manually copying structure from skills.

Required files should be derived from the Backtrail skill package under `packages/skills/` so initialization stays aligned with documented artifact expectations.

## Goal

Provide a user-visible CLI `init` command that bootstraps a project for Backtrail use by creating `.backtrail` and all required Backtrail files.

## Users / Use Cases

- Developer: runs the CLI init command in a repository and gets a ready-to-use `.backtrail` workspace.
- Maintainer: updates required Backtrail documents in `packages/skills/`, and init behavior can be kept consistent with those requirements.

## Scope

- Add an `init` command to the CLI in `apps/cli/`.
- When run, create `.backtrail/` if it does not exist.
- Create all required Backtrail files, including required index files discovered from docs/skill requirements in `packages/skills/`.
- Preserve existing user files by default; do not overwrite existing Backtrail records or indexes unless explicitly supported by implementation design.
- Report created, skipped, and error states clearly in CLI output.

## Non-Goals

- Implement ADR, FEATURE, CHANGE, or TASK creation flows.
- Migrate existing Backtrail content.
- Validate semantic correctness of existing Backtrail files.
- Add destructive reset behavior.

## Acceptance Criteria

- Given a repository without `.backtrail`, when user runs CLI init, then `.backtrail/` is created.
- Given a repository without Backtrail indexes, when user runs CLI init, then required index files such as ADR, FEATURE, CHANGE, and TASK indexes are created from current Backtrail requirements.
- Given existing `.backtrail` files, when user runs CLI init, then existing files are not overwritten and command reports skipped files.
- Given required docs in `packages/skills/` change, when implementation scans required docs, then init output can reflect current required files without hard-coded drift where practical.
- Given file creation fails, when user runs CLI init, then command exits non-zero and prints actionable error output.

## Dependencies

- `apps/cli/` command structure and argument parser.
- `packages/skills/` Backtrail skill docs that declare required Backtrail files and indexes.
- Filesystem access in the current working directory.

## Risks / Rollback

Risk: command may create files in the wrong directory if working-directory handling is unclear. Rollback: users can delete newly created `.backtrail` files; implementation should avoid overwrites to keep rollback safe.

Risk: scanning skill docs may be brittle if requirements are expressed only in prose. Rollback: keep scanning logic narrow and visible, with tests; allow fallback defaults only if documented.
