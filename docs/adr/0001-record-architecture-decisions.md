# 0001. Record architecture decisions

- Status: Accepted
- Date: 2026-10-02

## Context

FareRide is a long-running project built with AI assistance. Decisions need to stay explainable months later, by the maintainer and by any assistant reading the repository.

## Decision

Significant decisions are recorded as numbered Markdown files in `docs/adr/`, with Context, Decision and Consequences sections.

## Consequences

A decision that changes the architecture is not made silently: it lands as an ADR in the same pull request as the change.
