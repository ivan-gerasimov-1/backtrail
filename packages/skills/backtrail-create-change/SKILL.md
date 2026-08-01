---
name: backtrail-create-change
description: Create a Proposed CHANGE for ADR-backed, FEATURE-backed, or standalone work
---

## Purpose

Create CHANGE documentation only. Inspect code as needed, but write only CHANGE docs and `.backtrail/changes.md`.

CHANGE records describe concrete implementation work. They may be backed by an Accepted ADR or FEATURE, or stand alone when no durable decision is needed.

## Input

Use the text after this skill invocation as the change brief.

## Resources

- Use `assets/change-template.md` as the CHANGE template.
- Use `backtrail-create-task` after CHANGE creation when implementation needs staged review checkpoints.
- Always assess whether the CHANGE should have TASK records and tell the user the recommendation before writing.
- CHANGE template includes a placeholder `## Tasks` section.
- Delete the `## Tasks` section when no TASK records are required.
- When TASKs exist, the CHANGE file must link them through the canonical `## Tasks` section:

```md
## Tasks

- [TASK-NNNNN](tasks/task-NNNNN-title-slug.md)
```

## Statuses

- Allowed statuses: `Proposed`, `Blocked`, `Done`, `Abandoned`.
- Create step writes `Proposed` for implementable CHANGE records.
- Use `Blocked` only when a CHANGE is waiting on another CHANGE listed in `Blocked By`.

## Workflow

1. If the brief does not identify implementation work, ask for the change topic before creating files.
2. Read `.backtrail/changes.md`, `.backtrail/adl.md`, `.backtrail/features.md`, relevant FEATURE, ADR, and CHANGE docs. If `.backtrail/changes.md` or `.backtrail/changes/` is missing, plan to create it with columns for CHANGE, status, date, ADRs, blocked-by links, blocks links, and title/summary.
3. Apply the CHANGE gate before creating files.
   - If the brief references ADRs, verify that each ADR exists and is `Accepted`.
   - If the brief references FEATUREs, verify they exist. Prefer an `Accepted` FEATURE before creating implementation CHANGE records.
   - Use ADR- or FEATURE-backed changes when implementation work follows an `Accepted` ADR or FEATURE.
   - If work introduces or changes a durable decision that constrains future work, architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, or reversibility, stop; ADR Create must run first.
   - Use standalone changes only for concrete work with no new ADR need: bug fixes, local refactors, tests, existing ADR implementation details, copy changes, dependency patches, or task-local choices.
4. Determine the CHANGE number.
   - Use an explicit number only when it appears at the start of input, after optional whitespace.
   - Supported prefixes: `CHANGE-014`, `CHANGE 014`, `C-014`, `#14`, `#014`, `014`, `14`.
   - Normalize to five digits: `#14 Split decisions` -> `CHANGE-00014`, `.backtrail/changes/change-00014-split-decisions.md`.
   - Do not scan the input body for CHANGE numbers.
   - If no starting number exists, use the highest `CHANGE-NNNNN` from `.backtrail/changes.md` + 1.
   - If `.backtrail/changes.md` is missing, create it and start at `CHANGE-00001` unless the brief has an explicit starting number.
5. Stop if `.backtrail/changes/change-NNNNN-title-slug.md` already exists.
6. Assess whether dedicated rollback detail is required. Require it when the work:
   - destroys or irreversibly transforms data;
   - creates a public contract or compatibility break;
   - changes authentication, authorization, security, billing, or financial behavior;
   - requires a migration, compatibility window, coordinated deployment, or manual recovery; or
   - would be materially costly, risky, or operationally complex to reverse.
7. Present rough approach before writing.
   - goal
   - ADR links or standalone rationale
   - scope
   - implementation shape
   - verification
   - independent risks, when useful
   - rollback assessment and, only when a trigger applies, the reversal or recovery plan
   - TASK recommendation: `required`, `recommended`, or `not needed`, with one short reason
   - Use `required` when work is large, risky, parallelizable, depends on multiple checkpoints, or likely needs staged review.
   - Use `recommended` when the CHANGE is moderate but has useful checkpoints.
   - Use `not needed` only when the CHANGE is small and one review is enough.
8. Ask only questions that change scope, compatibility, verification, or a required reversal or recovery plan.
9. Create `.backtrail/changes/change-NNNNN-title-slug.md` from `assets/change-template.md`.
   - Add a dedicated `## Rollback` section only when a trigger in step 6 applies.
   - Omit the section rather than filling it with generic text when no trigger applies.
   - Add separate risk analysis when useful without adding `## Rollback` solely for that analysis.
   - If the TASK recommendation is `not needed`, delete the placeholder `## Tasks` section from the CHANGE file.
   - If the estimated implementation diff exceeds 500 lines or needs multiple reviewable checkpoints, keep one CHANGE as the scope contract and recommend `backtrail-create-task` to split implementation work.
   - Create multiple CHANGE records only when work has separate scope contracts or dependency relationships independent of task-level staging.
   - Keep CHANGE dependency links bidirectional: if a CHANGE lists another CHANGE in `Blocked By`, the blocker lists it in `Blocks`.
10. Save the CHANGE and its `.backtrail/changes.md` entry with status, ADR links, blocked-by links, blocks links, and title/summary. Use `Proposed` unless the CHANGE is blocked by another CHANGE.
11. When the TASK recommendation is `required` or `recommended`, ask whether to proceed with creating TASK records.
    - Use Yes/No buttons when `request_user_input` is available.
    - `Yes`: use `backtrail-create-task` with the selected CHANGE.
    - `No`: leave the CHANGE as created and report that implementation will run as one CHANGE unless TASKs are created later.
12. Stop after docs/status changes. Do not implement code.

## Question UX

- Use `request_user_input` when available for two or three meaningful choices.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not change implementation code, ADR files, FEATURE files, TASK files, configs, or tests.
- Do not overwrite existing CHANGE files.
- Do not mark CHANGE as `Done`.
- Do not treat numbers in input body as CHANGE numbers.
- Do not create standalone CHANGE records for work needing a new ADR. Stop and explain why ADR Create is required.
- Linking to a `Rejected`, `Deprecated`, or `Superseded` ADR requires explicit user confirmation.
