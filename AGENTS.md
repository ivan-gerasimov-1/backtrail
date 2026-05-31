# Agent Working Context

## General Guardrails

- Avoid editing automatically generated files.
- Install dependencies using `--save-exact` to ensure deterministic builds.
- Name files and directories using camelCase.
- If the user’s intent changes between turns, re-evaluate and switch to the matching skill before taking action.

## Engineering

- Before writing or changing code, read [engineering-conventions.md](./docs/engineering-conventions.md).
- Architecture decisions are tracked in [.backtrail/adl.md](.backtrail/adl.md).
