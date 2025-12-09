# Commit Command

Create a commit following the Conventional Commits specification.

## Instructions

1. Run `git status` to see modified files
2. Run `git diff --staged` to see staged changes (if no staged changes, show `git diff` for unstaged changes)
3. Analyze the changes and determine:
   - The appropriate commit type
   - An optional scope if applicable
   - A clear and concise description

## Conventional Commits Rules

**Format:** `<type>(<optional scope>): <description>`

**Available types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, semicolons, etc.)
- `refactor` - Code refactoring (no feature or fix)
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Build system or dependencies
- `ci` - CI/CD configuration
- `chore` - Other changes (maintenance, tooling)

**Mandatory rules:**

- Use imperative mood: "Add feature" not "Added feature"
- Keep subject line under 50 characters
- Do not end subject line with a period
- Use "!" for breaking changes (e.g., feat!: remove deprecated API)
- Do NOT include "Generated with Claude Code" footer
- Do NOT include "Co-Authored-By: Claude"

## Workflow

1. Show current status and changes
2. Analyze if changes should be split into multiple commits (e.g., unrelated changes, different features, or mixing types like feat + fix)
3. If multiple commits are recommended, propose how to split them and which files belong to each commit
4. If no staged changes, ask whether to `git add` specific files or all
5. Propose a commit message based on the changes
6. Ask for confirmation before executing the commit
7. Execute the commit with the approved message
8. If there are more commits to make, repeat from step 4
