# CHANGE-00006: Implement exec review subcommand

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Done | 2026-05-10 | -    | -          | -      |

## Goal

Implement FEATURE-00006 by adding `backtrail exec review`, a concrete exec subcommand that runs the `backtrail-review` skill through PI Coding Agent with model `5.5` and reasoning effort `low`.

## Scope

Included:

- Add `review` as a recognized `backtrail exec` subcommand.
- Assemble a review prompt that invokes the `backtrail-review` skill and includes supplied change, task, feature, and free-form prompt context.
- Configure review runtime defaults to model `5.5` and reasoning effort `low`.
- Support existing force behavior with review-specific prompt wording that preserves explicit safety and Backtrail skill guardrails.
- Reuse shared exec runtime spawning, result printing, and non-zero failure handling.
- Add or update tests for review routing, prompt assembly, runtime arguments, force behavior, and failure handling parity.

Excluded:

- Implementing review logic inside CLI code.
- Creating or mutating Backtrail artifacts from the CLI review command.
- Adding user-facing model, provider, or reasoning-effort override flags.
- Changing existing `exec create` or `exec implement` behavior.
- Adding persisted review history, multi-agent review orchestration, or background execution.

## Implementation

1. Locate existing `exec create` and `exec implement` command modules, shared exec runtime configuration, router wiring, and tests.
2. Add a review exec config/module that targets the `backtrail-review` skill and accepts review-relevant context flags plus free-form prompt text.
3. Set review runtime defaults to model `5.5` and reasoning effort `low` using the same path as existing command-specific defaults.
4. Wire `review` into the exec subcommand router and help output without changing create or implement behavior.
5. Extend force prompt composition so review force mode says not to ask user questions while preserving explicit safety and Backtrail skill guardrails.
6. Add tests covering command recognition, prompt composition, runtime argument defaults, force instruction text, success output, and failure handling.

## Verification

Run:

```bash
npm run test
```

Expected result:

- `backtrail exec review` is recognized as an exec subcommand.
- Tests verify review prompt assembly includes `backtrail-review` and supplied context.
- Tests verify spawned runtime arguments use model `5.5` and reasoning effort `low`.
- Force-mode tests verify the review prompt preserves safety and Backtrail guardrail language.
- Existing `exec create` and `exec implement` tests remain unchanged.

## Rollback

Remove the review command module/config, router wiring, and related tests. Keep shared exec runtime, create, implement, and force behavior unchanged.

## Related

- [FEATURE-00006](../features/feature-00006-exec-review-subcommand.md)
