# Git Commit Instructions

All commit messages must be written in English.

## Format

Use:

```text
type: short description
```

Optional scope when it adds useful context:

```text
type(scope): short description
```

## Allowed types

- `feat`: new functionality
- `fix`: bug fix
- `docs`: documentation changes
- `test`: unit, integration or end-to-end tests
- `refactor`: internal change without changing expected behavior
- `chore`: maintenance or project housekeeping
- `style`: formatting or visual-only code changes without logic changes
- `build`: build system, packaging or dependency changes
- `perf`: performance improvement
- `ci`: continuous integration or automation changes

## Description rules

- Use a short action-oriented description.
- Start with a verb such as `add`, `update`, `remove`, `fix`, `improve`, `simplify`, `prevent` or `validate`.
- Do not end with a period.
- Describe the main change, not the development history.
- Prefer one logical change per commit.
- Keep the description concise; roughly 2–10 words is a useful target when possible.
- Do not use vague messages such as `changes`, `updates`, `fix stuff` or `final version`.

## Examples

```text
feat: add export option
fix: prevent duplicate entries
docs: update installation guide
test: add file validation tests
refactor: simplify validation logic
chore: update project configuration
style: reduce footer spacing
build: update build dependencies
perf: reduce startup time
ci: update release workflow
```

With an optional scope:

```text
feat(auth): add recovery flow
fix(upload): handle cancelled transfers
```

## Breaking changes

When a commit introduces an intentional incompatible change, use `!`:

```text
feat!: change configuration format
```

Explain the migration or impact in the commit body when necessary.
