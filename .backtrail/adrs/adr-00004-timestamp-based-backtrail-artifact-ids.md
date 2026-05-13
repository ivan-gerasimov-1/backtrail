# ADR-00004: Timestamp-Based Backtrail Artifact IDs

| Status   | Date       |
| -------- | ---------- |
| Proposed | 2026-05-12 |

## Context

Backtrail artifacts currently use per-type monotonic numeric IDs such as `ADR-00003`, `CHANGE-00009`, `FEATURE-00006`, and `TASK-00022`. Creation skills determine the next ID by reading the matching index and adding one.

That allocation model is easy to read, but it creates merge and concurrency conflicts when multiple agents, branches, or users create records from the same index state. Conflicts affect both index rows and generated artifact paths, because the numeric ID is embedded in file names and links.

A durable artifact ID contract is needed before changing skills, templates, generated output, and any CLI behavior that accepts or displays Backtrail record IDs.

## Decision

Backtrail will use timestamp-derived IDs for newly created artifact records instead of sequential numeric indexes.

Rules:

- New ADR, FEATURE, CHANGE, and TASK records use IDs formed from the artifact prefix plus a UTC timestamp, for example `ADR-20260512T153045Z`.
- Timestamp IDs are generated at record creation time and are not renumbered.
- Artifact file names include the timestamp ID and title slug, for example `.backtrail/adrs/adr-20260512T153045Z-timestamp-based-backtrail-artifact-ids.md`.
- Index files remain append-only summaries and stop acting as ID allocation sources for new records.
- Existing numeric records remain valid and linkable. Implementations must support both numeric and timestamp IDs during the transition.
- If two records are created in the same second for the same artifact type, creation must fail safely or add a deterministic collision suffix instead of overwriting an existing file.
- Explicit user-provided IDs are allowed only when they match a supported Backtrail ID format and do not collide with an existing artifact.

## Consequences

Positive:

- Parallel record creation no longer depends on a shared next-number read from an index.
- Merge conflicts in Backtrail indexes become less likely and easier to resolve.
- Artifact IDs carry creation time, which helps sort and audit records without central allocation.

Negative:

- IDs become longer and less human-friendly than five-digit numbers.
- The repository will contain mixed numeric and timestamp ID formats for existing and new records.
- Skills, templates, tests, documentation, and CLI parsing need coordinated updates.
- Timestamp generation needs deterministic timezone and collision handling rules.

## Alternatives Considered

- Keep numeric IDs and resolve conflicts manually: preserves readability, but keeps the shared allocation bottleneck.
- Allocate numeric ranges per agent or branch: reduces some conflicts, but adds coordination rules and still creates collisions when ranges are exhausted or misused.
- Use random UUIDs: avoids coordination, but IDs are harder to scan and do not preserve creation ordering.

## Reversibility

This decision can be superseded by a later ADR that returns to numeric IDs or chooses another ID scheme. Rollback must keep existing timestamp-named artifacts addressable or include an explicit migration plan for renaming files, rewriting links, and updating indexes.

## Related Decisions

- [ADR-00003](adr-00003-backtrail-cli-config-file.md)
