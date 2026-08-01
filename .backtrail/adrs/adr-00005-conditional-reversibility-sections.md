# ADR-00005: Conditional Reversibility Sections

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-08-01 |

## Context

Backtrail ADR, FEATURE, and CHANGE templates currently require dedicated reversibility or rollback content regardless of a record's impact. Most routine decisions and implementation plans have an obvious rollback path, so requiring these sections produces repetitive text without improving execution safety.

TASK records already omit a rollback section. The other artifact types need a consistent rule that keeps routine records concise while still requiring an explicit recovery plan for consequential work.

## Decision

Reversibility and rollback sections are optional in ADR, FEATURE, and CHANGE records and are omitted by default.

A dedicated section is required when the proposed work has at least one of these characteristics:

- destroys or irreversibly transforms data;
- creates a public contract or compatibility break;
- changes authentication, authorization, security, billing, or financial behavior;
- requires a migration, compatibility window, coordinated deployment, or manual recovery;
- would be materially costly, risky, or operationally complex to reverse.

Creation skills and templates must state these triggers explicitly. When no trigger applies, the section is removed rather than filled with generic text. TASK records remain unchanged and should carry rollback detail only when their parent CHANGE requires it and the task owns part of that plan.

Risk analysis that is useful independently of rollback may remain in the relevant artifact without forcing a rollback section.

## Consequences

Positive:

- Routine records contain less boilerplate and focus on decisions, behavior, and implementation.
- High-impact work still requires an explicit reversal or recovery plan.
- ADR, FEATURE, CHANGE, and TASK guidance follows one impact-based policy.

Negative:

- Authors and agents must evaluate the triggers instead of following a purely mechanical template.
- A poorly evaluated record may omit rollback detail that would have been useful.
- Templates and creation skills must stay aligned to prevent inconsistent records.

## Alternatives Considered

- Keep rollback sections mandatory everywhere: mechanically consistent, but continues producing low-value boilerplate for routine work.
- Make sections optional without triggers: simpler wording, but too subjective to apply reliably.
- Apply the policy only to ADRs: reduces some noise, but leaves the same problem in FEATURE and CHANGE records.

## Reversibility

This documentation policy can be superseded by restoring mandatory sections in templates and creation skills. Existing records do not need migration because both policies accept documents that already contain rollback or reversibility sections.

