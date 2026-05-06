---
name: backtrail-create-task
description: Create TASK records by splitting a CHANGE into reviewable implementation checkpoints
---

## Purpose

Create TASK documentation only. Inspect code as needed, but write only TASK docs, `.backtrail/tasks.md`, and task link fields in existing CHANGE docs when needed.

TASK records split one CHANGE scope contract into one or more small, reviewable implementation checkpoints.

Every TASK must produce concrete implementation output such as code, tests, docs, config, or generated user-visible artifacts. Do required inspection, planning, and contract definition during task creation; do not create analysis-only, inspection-only, or contract-only TASK records.

## Input

Use the text after this skill invocation as the task brief. The brief should identify a CHANGE id or provide enough context to choose one CHANGE.

## Resources

- Use `assets/task-template.md` as the TASK template.
- CHANGE-to-TASK links must use this exact section in the CHANGE file:

```md
## Tasks

- [TASK-NNNNN](tasks/task-NNNNN-title-slug.md)
```

- Use one bullet per TASK, sorted by TASK id.

## Statuses

- Allowed TASK statuses: `Todo`, `Blocked`, `In Progress`, `Done`, `Cancelled`.
- Create every task with no blockers as `Todo`.
- Create tasks with one or more unfinished blockers as `Blocked`.
- One task may be blocked by multiple tasks when it depends on several checkpoints.

## Workflow

1. If the brief does not identify task planning for implementation work, ask for the CHANGE id or implementation topic before creating files.
2. Read `.backtrail/tasks.md`, `.backtrail/changes.md`, `.backtrail/adl.md`, `.backtrail/features.md`, relevant CHANGE, ADR, FEATURE, and existing TASK docs. If `.backtrail/tasks.md` or `.backtrail/tasks/` is missing, plan to create it with columns for TASK, status, date, CHANGE, blocked-by links, blocks links, and title/summary.
3. Select the CHANGE.
   - If input starts with `CHANGE-00014`, `CHANGE 00014`, `C-00014`, `#14`, `#014`, `014`, or `14`, prefer the matching CHANGE record when it exists.
   - Otherwise, list candidate CHANGE records with status `Proposed` or `Blocked` and ask the user to choose one when more than one exists.
   - Stop unless the selected CHANGE exists.
4. Apply the TASK gate before creating files.
   - Create TASKs only under one existing CHANGE.
   - Do not create TASKs that expand the CHANGE scope.
   - If the split reveals missing scope, stop and ask to update or create the CHANGE first.
   - If the CHANGE links ADRs, verify each linked ADR exists and is `Accepted` unless the CHANGE documents a non-gating/historical link.
   - If the CHANGE links FEATUREs, verify each linked FEATURE exists and is `Accepted` unless the CHANGE documents a non-gating/historical link.
5. Determine TASK numbers.
   - Use an explicit starting number only when it appears at the start of input, after optional whitespace.
   - Supported prefixes: `TASK-014`, `TASK 014`, `T-014`, `#14`, `#014`, `014`, `14`.
   - Normalize to five digits: `#14 Add task index` -> `TASK-00014`, `.backtrail/tasks/task-00014-add-task-index.md`.
   - Do not scan the input body for TASK numbers.
   - If no starting number exists, use the highest `TASK-NNNNN` from `.backtrail/tasks.md` + 1.
   - If `.backtrail/tasks.md` is missing, create it and start at `TASK-00001` unless the brief has an explicit starting number.
6. Split the CHANGE into the smallest useful TASK records.
   - If only one task is needed, create one.
   - Each task must have a concrete output that changes project artifacts.
   - Do not create prerequisite tasks whose only output is inspection, planning, contract definition, or research.
   - Prefer 150-250 lines or one logical commit as the rough upper bound per task.
   - Ten or more tasks is acceptable when that keeps review small.
   - Use sequential blocking when tasks depend on previous checkpoints.
   - Use parallel TASKs when work can be implemented and reviewed at the same time.
   - Allow one TASK to list multiple blockers when it depends on several prior TASKs.
7. Stop if any target `.backtrail/tasks/task-NNNNN-title-slug.md` already exists.
8. Present rough task plan before writing.
   - selected CHANGE
   - task list
   - dependency links, including parallel branches and multi-blocker tasks when useful
   - scope boundaries
   - verification per task
9. Ask only questions that change task boundaries, dependencies, or verification.
10. Create each `.backtrail/tasks/task-NNNNN-title-slug.md` from `assets/task-template.md`.
    - Tasks with no blockers: `Todo`.
    - Tasks with one or more blockers: `Blocked` with `Blocked By: TASK-NNNNN` or comma-separated TASK ids.
    - Parallel tasks may share the same blocker or have no blockers.
    - Join tasks may be blocked by multiple previous TASKs.
    - Keep dependency links bidirectional: if a TASK lists another TASK in `Blocked By`, each blocker lists it in `Blocks`.
11. Save `.backtrail/tasks.md` entries with status, CHANGE link, blocked-by links, blocks links, and title/summary.
12. Update the selected CHANGE file with the canonical TASK link section. Do not change the CHANGE status.
    - Use exactly `## Tasks` as the heading.
    - Add one Markdown link per created TASK: `- [TASK-NNNNN](tasks/task-NNNNN-title-slug.md)`.
    - If a `## Tasks` section already exists, append missing created TASK links and preserve existing valid links.
    - If task links exist in any non-canonical format, replace them with the canonical `## Tasks` section.
    - Keep links relative to `.backtrail/changes/change-NNNNN-title-slug.md`, so paths start with `tasks/`.
13. Stop after docs/status changes. Do not implement code.

## Question UX

- Use `request_user_input` when available for two or three meaningful choices.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not change implementation code, ADR files, FEATURE files, configs, or tests.
- Do not overwrite existing TASK files.
- Do not mark TASK records as `Done` or CHANGE records as `Done`.
- Do not treat numbers in input body as TASK numbers.
- Do not create TASKs without one backing CHANGE.
- Do not create TASKs without concrete artifact output; inspect and define execution steps before writing TASK docs instead.
- Do not silently expand CHANGE scope; update or create CHANGE first.
- Keep CHANGE status `Proposed` until implementation finishes; TASK progress drives staged work.
