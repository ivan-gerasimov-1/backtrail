# Backtrail

> AI-assisted. Human verification is default assumption.

Agent skills for ADR-backed planning and implementation workflows.

## Config file

Backtrail CLI reads workspace config from `.backtrail/backtrail.config.json` by default.

- `backtrail init` creates `.backtrail/backtrail.config.json` with `{}` when missing.
- Commands load config before command-specific work runs.
- Use `--config <path>` to override default path.
- Missing default config file is allowed when command can continue with defaults.
- Malformed JSON and unreadable explicit paths fail with clear errors.
