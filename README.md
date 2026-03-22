# ai-tools

> cli tool to supercharge your development workflow with ai.

<img width="1398" height="646" alt="image" src="https://github.com/user-attachments/assets/937be828-a977-4e59-87e4-516a1bc2e5b0" />

---

## features

- ai-powered code review
- automatic commit message generation (conventional commits)
- supports staged and branch-based reviews
- fully customizable models and prompts via a single json config file
- free and pro mode — use whichever models match your openrouter plan
- easy to extend with new commands and features

---

## requirements

- node.js 20+
- openrouter api key

---

## installation

### global install (recommended)

```bash
npm install -g ai-tools
```

or for development:

```bash
npm link
```

---

## setup

### 1. openrouter api key

this tool uses [openrouter](https://openrouter.ai) as its ai provider, giving you access to dozens of models with a single api key.

[how do i create an openrouter api key?](https://openrouter.ai/settings/keys)

export it in your shell:

```bash
export OPENROUTER_API_KEY=your_key_here
```

to persist it, add it to your `~/.bashrc` or `~/.zshrc`:

```bash
echo 'export OPENROUTER_API_KEY=your_key_here' >> ~/.zshrc
source ~/.zshrc
```

### 2. configure ai.config.json

the tool is driven by a `config/ai.config.json` file. this is where you define which models to use, which mode you're operating in, and what prompts the ai should follow.

---

## configuration

### ai.config.json

```json
{
  "mode": "free",
  "models": {
    "free": {
      "pools": {
        "general": ["stepfun/step-3.5-flash:free"],
        "fallback": ["openai/gpt-oss-20b:free"],
        "cheap": ["minimax/minimax-m2.5:free"]
      }
    },
    "pro": {
      "pools": {
        "general": ["anthropic/claude-3.5-sonnet", "openai/gpt-4o"],
        "fallback": ["anthropic/claude-3-haiku"],
        "cheap": ["openai/gpt-4o-mini"]
      }
    }
  },
  "prompts": {
    "review": {
      "system": "You are a senior software engineer performing a code review...",
      "template": "Review the following diff:\n\n{diff}"
    },
    "commit": {
      "system": "You are an expert at writing conventional commit messages...",
      "template": "Generate a commit message for the following diff:\n\n{diff}"
    }
  }
}
```

### mode: free vs pro

the `mode` field tells the tool which model pool to use when making requests. it does not change how the tool works — it simply points to a different set of models.

| mode | when to use |
|------|-------------|
| `"free"` | you're using free-tier models available on openrouter |
| `"pro"` | you have credits on openrouter and want to use paid models |

set `"mode": "pro"` if you have an openrouter paid plan and want to use models like `claude-3.5-sonnet` or `gpt-4o`.

### model pools

each mode has three pools. the tool picks models from each pool depending on the context of the request:

| pool | purpose |
|------|---------|
| `general` | default pool — used for most requests |
| `fallback` | used when the primary model fails or is unavailable |
| `cheap` | used for lighter tasks where cost matters more than quality |

you can list multiple models in each pool and the tool will rotate or fall back through them automatically.

### prompts

you can fully customize the instructions given to the ai for each command.

- `system` — sets the ai's role and behavior (what kind of assistant it should be)
- `template` — the actual prompt sent with each request. use `{diff}` as a placeholder for the git diff content

this means you can tailor the review and commit output to match your team's standards, language, or commit convention.

---

## usage

### code review

review changes on your current branch compared to a base:

```bash
ai-tools review
```

review against a specific base branch:

```bash
ai-tools review --base main
```

review only staged changes:

```bash
git add .
ai-tools review --staged
```

### commit message generation

generate a conventional commit message from your current changes:

```bash
ai-tools commit
```

generate from a specific base branch:

```bash
ai-tools commit --base main
```

generate from staged changes only:

```bash
git add .
ai-tools commit --staged
```

> note: `--base` and `--staged` cannot be used together.

---

## how review works

the review command analyzes your git changes using one of two modes:

### branch comparison (default)

compares your current branch against a base branch:

```bash
git diff <base>...HEAD
```

the base branch is automatically detected in the following order:

1. `master`
2. `staging`
3. `development`

you can override it manually with `--base <branch>`.

### staged changes

analyzes only what is currently staged:

```bash
git diff --staged
```

useful for reviewing what you're about to commit.

---

## logs

ai-tools saves logs of ai responses and errors locally.

logs are stored at:

```
~/.config/ai-tools/logs/
  ├── review/
  ├── commit/
  └── error/
```

each execution creates a file with a timestamp, the ai response (or error details), and the request context. useful for debugging, auditing, or keeping a history of generated outputs.

---

## tech stack

- typescript
- commander
- axios

---

## notes

- your api key is never stored — it is only read from environment variables at runtime
- make sure your key is correctly exported before running any command

---

## license

isc
