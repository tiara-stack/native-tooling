# Domain docs

How engineering skills should use this repository's domain documentation.

## Before exploring, read these

- `CONTEXT.md` at the repo root
- `docs/adr/` for decisions that affect the area being changed

If these files don't exist, proceed silently. Don't flag their absence or suggest creating them upfront. The domain-modeling skill creates them when terminology or decisions are resolved.

## File structure

This repository uses a single-context layout:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
├── packages/
└── native/
```

## Use the glossary's vocabulary

Use terms as defined in `CONTEXT.md` in issue titles, proposals, hypotheses, and test names. If a needed term isn't there, note that gap for domain modeling instead of inventing a synonym.

## Flag ADR conflicts

If a proposed change conflicts with an existing ADR, call that out explicitly rather than silently overriding it.
