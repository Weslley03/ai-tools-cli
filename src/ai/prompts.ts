export function reviewPrompt(diff: string) {
  return `
    You are a senior fullstack engineer doing a thorough code review.
    Analyse the following git diff from a pull request and provide a structured review covering:
    1. **Bugs & correctness issues** — logic errors, edge cases, null/undefined risks
    2. **Security concerns** — injection, exposure of secrets, auth issues
    3. **Performance** — unnecessary re-renders, N+1 queries, heavy operations
    4. **Code quality** — readability, naming, duplication, SOLID principles
    5. **Quick wins** — small improvements worth doing right now
    Be direct and specific. Point to the exact lines when relevant.
    If something looks good, say so briefly — focus energy on real issues.
    ${diff}
  `
}

export function commitPrompt(diff: string) {
  return `
    You are a developer writing git commit messages.
    Based on the following diff, write a single conventional commit message.
    Rules:
    - ALL lowercase, no exceptions
    - Format: <type>(<scope>): <short description>
    - Types: feat, fix, refactor, style, test, docs, chore, perf
    - Scope is optional but use it when obvious (e.g. auth, api, ui, db)
    - Description: max 72 chars, imperative mood (\"add\", not \"added\")
    - After the subject line, add ONE blank line then a short body (2-4 lines max) explaining WHAT changed and WHY, if it's not obvious
    - Each body line must start with "- "
    - Body lines also ALL lowercase
    - No markdown, no quotes around the message
    - Output ONLY the commit message, nothing else
    ${diff}
  `
}