# TASK-00013: Move exec review command module

| Status   | Date       | Change       | Blocked By | Blocks |
| -------- | ---------- | ------------ | ---------- | ------ |
| Done  | 2026-05-10 | [CHANGE-00007](../changes/change-00007-refactor-command-module-layout.md) | [TASK-00012](task-00012-move-exec-implement-command-module.md) | - |

## Goal

Move the `exec review` workflow into its command-owned directory and complete layout verification for CHANGE-00007.

## Scope

- Move `apps/cli/src/commands/execReview.ts`, `execReview.test.ts`, and `execReviewConfig.ts` under `apps/cli/src/commands/execReview`.
- Update imports and CLI wiring affected by the move.
- Keep shared exec runtime/result/config helpers and shared command types in `apps/cli/src/commands` root.
- Exclude behavior changes to review prompts, model defaults, flags, or output.

## Acceptance Criteria

- `exec review` entrypoint, config, and tests live under `apps/cli/src/commands/execReview`.
- `apps/cli/src/commands` root contains only shared command files plus command directories after prior tasks are complete.
- Public `backtrail exec review` behavior, prompts, model defaults, flags, and output remain unchanged.

## Verification

Run:

```bash
npm run test -- --run execReview
npm run test
npm run typecheck
```

Expected result:

- Exec review command tests pass.
- Full test suite passes.
- Typecheck passes.
