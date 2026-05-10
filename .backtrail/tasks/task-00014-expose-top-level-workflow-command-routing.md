# TASK-00014: Expose top-level workflow command routing

| Status   | Date       | Change       | Blocked By | Blocks |
| -------- | ---------- | ------------ | ---------- | ------ |
| Done | 2026-05-10 | [CHANGE-00008](../changes/change-00008-implement-top-level-backtrail-workflow-commands.md) | - | [TASK-00015](task-00015-rename-create-command-module.md), [TASK-00016](task-00016-rename-implement-and-review-command-modules.md) |

## Goal

Register Backtrail workflow commands at the CLI root and remove the public `exec` command namespace in one reviewable routing checkpoint.

## Scope

- Update `apps/cli/src/cli.ts` to expose `create`, `implement`, and `review` as top-level commands.
- Remove `exec` parent command registration and public subcommand wiring.
- Update `apps/cli/src/cli.test.ts` to assert top-level command registration, option behavior, invocation, failure handling, and absence of public `exec` workflow namespace.
- Keep command module paths and exported command handler names unchanged until later rename tasks.
- Exclude prompt text, model defaults, force flag behavior, and spawned agent execution semantics.

## Acceptance Criteria

- `backtrail create`, `backtrail implement`, and `backtrail review` parse and invoke existing workflow handlers with unchanged options.
- CLI tests fail if `backtrail exec create`, `backtrail exec implement`, or `backtrail exec review` remains registered as the public workflow namespace.
- User-facing behavior other than command path remains unchanged.

## Verification

Run:

```bash
npm run test -- --run cli
```

Expected result:

- CLI routing tests pass for top-level workflow commands.
- CLI routing tests verify the public `exec` workflow namespace is absent.
