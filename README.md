# Active Seniors Guernsey

Public directory of activities, clubs, societies and volunteering opportunities
across Guernsey, built for the [G-Prize 2026](https://innovateguernsey.com/gprize)
Active Ageing challenge. Live at https://active-seniors.github.io.

## How listings work

- Every listing is a Markdown file in [`_listings/`](_listings/) with structured
  YAML frontmatter — see [`_listings/st-peter-port-walking-group.md`](_listings/st-peter-port-walking-group.md)
  for an example, and the schema notes in the
  [planning repo](https://github.com/active-seniors/planning/blob/main/listing-frontmatter-schema.md).
- Additions, edits and removals are submitted as pull requests. AI agents,
  external contributors and the editorial team all go through the same PR
  route — nothing publishes without a human reviewer approving it.
- Listings are periodically reviewed for accuracy (see each listing's
  `verification` block); stale listings get flagged for re-review, not
  silently left to rot.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

## Related repos

- [`planning`](https://github.com/active-seniors/planning) — internal planning docs (private).
- [`orchestration`](https://github.com/active-seniors/orchestration) — AI agents that discover, verify and match listings (private for now).
