# CHANGE-00010: Implement Conditional Reversibility Sections

| Status   | Date       | ADRs                                                                 | Blocked By | Blocks |
| -------- | ---------- | -------------------------------------------------------------------- | ---------- | ------ |
| Proposed | 2026-08-01 | [ADR-00005](../adrs/adr-00005-conditional-reversibility-sections.md) | -          | -      |

## Goal

Update Backtrail's published templates and creation skills so rollback and reversibility sections are omitted by default and required only for materially risky or difficult-to-reverse work.

## Scope

Includes the ADR, FEATURE, and CHANGE templates and creation-skill instructions under `packages/skills/`, with consistent conditional triggers from ADR-00005.

Excludes changes to TASK structure, previously created Backtrail records, installed or generated skill copies, unrelated review guidance, and implementation outside the skills package.

## Implementation

1. Remove the default `Reversibility` section from the ADR template, `Risks / Rollback` section from the FEATURE template, and `Rollback` section from the CHANGE template.
2. Add consistent guidance to the ADR, FEATURE, and CHANGE creation skills requiring a dedicated reversal or recovery section only when an ADR-00005 trigger applies.
3. Update each creation workflow's approach, question, and artifact-writing steps so optional risk and rollback content is assessed explicitly but omitted when unnecessary.
4. Keep independent risk analysis available without requiring rollback content.
5. Verify the published package contains the updated templates and instructions and no unconditional rollback-section requirement remains in the affected creation workflows.

## Verification

Run:

```bash
pnpm test
pnpm typecheck
pnpm --filter @backtrail/skills pack --dry-run
```

Expected result:

- Existing repository checks pass.
- The skills package dry run includes the updated ADR, FEATURE, and CHANGE templates and skill instructions.
- A content search confirms the affected workflows require rollback detail only when an ADR-00005 trigger applies.
