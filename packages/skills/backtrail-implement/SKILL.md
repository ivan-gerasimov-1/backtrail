---
name: backtrail-implement
description: Implement a CHANGE record after user confirmation
---

## Purpose

Implement an existing CHANGE record after confirming selected work with the user. If the CHANGE has TASK records, implement eligible TASK records first; otherwise implement the CHANGE directly.

## Input

Use the text after this skill invocation to select the CHANGE record.

## Statuses

- Allowed CHANGE statuses: `Proposed`, `Blocked`, `Done`, `Abandoned`.
- Allowed TASK statuses: `Todo`, `Blocked`, `In Progress`, `Done`, `Cancelled`.
- Treat dependency readiness as derived from linked CHANGE or TASK statuses, not from `Blocked` alone.
- CHANGE `Blocked` means waiting on CHANGE dependencies listed in `Blocked By`.
- TASK `Blocked` means waiting on TASK dependencies listed in `Blocked By`.

## Workflow

1. Read `.backtrail/changes.md`, `.backtrail/tasks.md`, `.backtrail/adl.md`, and `.backtrail/features.md` when they exist.
2. Select work.
   - If input starts with `CHANGE-00014`, `CHANGE 00014`, `C-00014`, `#14`, `#014`, `014`, or `14`, prefer the matching CHANGE record when it exists.
   - Otherwise, list eligible CHANGE records: status neither `Done` nor `Abandoned`, and not `Blocked` unless every CHANGE listed in `Blocked By` is `Done`.
   - If no eligible CHANGE records exist, stop and report that no implementable CHANGE exists.
   - If exactly one eligible CHANGE record exists, select it automatically.
   - If two or more eligible CHANGE records exist, ask the user to choose one. Use `request_user_input` when available.
3. Stop unless the selected CHANGE exists.
4. If the selected CHANGE is `Blocked`, read every CHANGE listed in `Blocked By`.
   - If any blocker is missing, stop and report the missing CHANGE links.
   - If any blocker status is not `Done`, stop and report the blocking CHANGE ids and statuses.
   - If every blocker is `Done`, update the selected CHANGE file and `.backtrail/changes.md` from `Blocked` to `Proposed` before continuing.
5. If the selected CHANGE links ADRs, stop unless every linked ADR exists and has status `Accepted`.
6. If the selected CHANGE links FEATUREs, stop unless every linked FEATURE exists and has status `Accepted`.
7. Read the selected CHANGE, linked TASKs, and linked ADRs or FEATUREs, if any.
   - Linked TASKs are defined only by the selected CHANGE file's canonical `## Tasks` section.
   - Canonical TASK link format: `- [TASK-NNNNN](tasks/task-NNNNN-title-slug.md)`.
   - Ignore TASK ids outside the `## Tasks` section for CHANGE-to-TASK linkage.
   - Stop if `.backtrail/tasks.md` lists tasks for the selected CHANGE that are missing from the CHANGE `## Tasks` section; ask to fix task links first.
   - Stop if the `## Tasks` section contains malformed links, duplicate TASK ids, missing TASK files, or TASK records whose `Change` field does not match the selected CHANGE.
8. Choose implementation mode.
   - If the CHANGE has linked TASK records that are not `Done` or `Cancelled`, implement TASK mode.
   - If the CHANGE has no linked TASK records, implement CHANGE mode.
   - If every linked TASK is `Done` or `Cancelled`, skip code changes and continue to CHANGE completion checks.
9. TASK mode:
   - Validate each linked TASK belongs to the selected CHANGE and does not expand CHANGE scope.
   - Treat TASK records with status `Cancelled` as excluded work. Stop if cancelled work is required for CHANGE acceptance.
   - Unblock TASK records before selection when every TASK listed in `Blocked By` is `Done`; update each unblocked TASK file and `.backtrail/tasks.md` from `Blocked` to `Todo`.
   - Eligible TASKs have status `Todo` or `In Progress` and no unfinished blockers.
   - If no eligible TASK exists, stop and report remaining TASK blockers and statuses.
   - If exactly one eligible TASK exists, select it automatically. If two or more eligible TASKs exist, ask the user to choose one; include parallel TASKs as separate choices.
   - Summarize selected TASK goal, scope, acceptance criteria, verification, dependency context, and parent CHANGE context.
   - Prepare step-by-step TASK implementation plan.
   - Ask whether to implement the selected TASK now.
     - Use Yes/No buttons when `request_user_input` is available.
     - `Yes`: continue to implementation.
     - `No`: stop without changing files.
   - Before code changes, update the selected TASK file and `.backtrail/tasks.md` status to `In Progress` unless already `In Progress`.
   - Implement only selected TASK scope and run its verification.
   - If verification passes, update the selected TASK file and `.backtrail/tasks.md` status to `Done`.
   - If verification passes, read each TASK listed in selected TASK `Blocks`; when all its blockers are `Done`, update that TASK file and `.backtrail/tasks.md` from `Blocked` to `Todo`.
   - If verification fails, leave selected TASK as `In Progress` and report failures.
   - After a TASK reaches `Done`, if every linked TASK for the CHANGE is `Done` or `Cancelled`, run CHANGE-level verification when specified. If it passes, update the CHANGE file and `.backtrail/changes.md` status to `Done`; otherwise leave CHANGE status unchanged and report failures.
10. CHANGE mode:
   - Summarize decision context, change scope, implementation steps, verification, dependencies, and rollback. For standalone CHANGE records, state that no ADR or FEATURE gate applies.
   - Prepare step-by-step CHANGE implementation plan.
   - Ask whether to implement the selected CHANGE now.
     - Use Yes/No buttons when `request_user_input` is available.
     - `Yes`: continue to implementation.
     - `No`: stop without changing files.
   - Implement the CHANGE and run its verification.
   - If verification passes, update the CHANGE file and `.backtrail/changes.md` status to `Done`.
   - If verification fails, leave status unchanged and report failures.
11. If the CHANGE reaches `Done`, read each CHANGE listed in `Blocks`.
   - If the blocked CHANGE is missing, report the missing link and continue without inventing a record.
   - If every CHANGE listed in that record's `Blocked By` field is `Done`, update that CHANGE file and `.backtrail/changes.md` status from `Blocked` to `Proposed`.
   - If any blocker is not `Done`, leave the dependent CHANGE as `Blocked` and report remaining blockers.
12. If the CHANGE reaches `Done` and implements linked FEATUREs, update those FEATURE files and `.backtrail/features.md` status to `Implemented`.

## Question UX

- Use `request_user_input` when available for two or three meaningful choices.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not infer missing CHANGE records.
- If implementation needs to change an ADR decision, stop and ask for a new or updated ADR.
- If implementation needs to change a FEATURE scope, acceptance criteria, or status gate, stop and ask for a new or updated FEATURE.
- If implementation needs a different scope than the CHANGE describes, stop and ask whether to update the CHANGE first.
- In TASK mode, do not implement outside selected TASK scope.
- Do not mark a CHANGE `Done` until every linked TASK is `Done` or `Cancelled` and CHANGE-level verification passes when specified.
