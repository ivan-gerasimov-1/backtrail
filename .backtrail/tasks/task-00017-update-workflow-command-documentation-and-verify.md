# TASK-00017: Update workflow command documentation and verify

| Status   | Date       | Change       | Blocked By | Blocks |
| -------- | ---------- | ------------ | ---------- | ------ |
| Blocked  | 2026-05-10 | [CHANGE-00008](../changes/change-00008-implement-top-level-backtrail-workflow-commands.md) | [TASK-00015](task-00015-rename-create-command-module.md), [TASK-00016](task-00016-rename-implement-and-review-command-modules.md) | - |

## Goal

Update user-facing command references and complete full verification for CHANGE-00008.

## Scope

- Update documentation, examples, README content, package docs, and site copy that advertise `backtrail exec create`, `backtrail exec implement`, or `backtrail exec review`.
- Leave internal `exec` wording in shared runtime helpers when it describes process execution rather than public command routing.
- Run full test and typecheck gates after routing and module rename tasks are complete.
- Exclude adding compatibility aliases for `backtrail exec ...`.

## Acceptance Criteria

- User-facing docs/examples advertise `backtrail create`, `backtrail implement`, and `backtrail review` only.
- No docs/examples present `backtrail exec ...` as the workflow command surface.
- Full test suite and typecheck pass after all CHANGE-00008 implementation tasks.

## Verification

Run:

```bash
rg "backtrail exec (create|implement|review)|execCreate|execImplement|execReview" README.md docs apps package.json
npm run test
npm run typecheck
```

Expected result:

- Search returns no user-facing public workflow command references to `backtrail exec ...` and no command-specific old module identifiers.
- Full test suite passes.
- Typecheck passes.
