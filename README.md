# ai-tools

cli tool to supercharge your development workflow with ai.

## features

* ai-powered code review
* automatic commit message generation (conventional commits)
* supports staged and branch-based reviews
* fully customizable prompts
* easy to extend with new commands and features

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

this tool requires an openrouter api key. this way, you can use whichever 'model you want.
'how do i create an api access key on openrouter?' [click_here](https://openrouter.ai/settings/keys)

set it in your shell:

```bash
export OPENROUTER_API_KEY=your_key_here
```

you can add this to your `~/.bashrc` or `~/.zshrc`:

```bash
echo 'export OPENROUTER_API_KEY=your_key_here' >> ~/.bashrc
source ~/.bashrc
```

---

## usage

### code review (default)

```bash
ai-tools review
```

### review against a specific base branch

```bash
ai-tools review --base master
```

### review only staged changes (before commit)

```bash
git add .
ai-tools review --staged
```

> note: `--base` and `--staged` cannot be used together.

---

### generate commit message

```bash
ai-tools commit
```

---

## customization

this project is designed to be flexible and hackable.

you are free to:

* modify the prompts to match your own style or workflow
* change the ai model or provider
* add new commands to the cli
* extend existing features

feel free to fork the project and adapt it however you want.

---

## how review works

the review command analyzes your git changes using one of the following modes:

### branch comparison (default)

compares your current branch against a base branch:

```bash
git diff <base>...HEAD
```

the base branch is automatically detected using the following priority:

* master
* staging
* development

you can override it manually:

```bash
ai-tools review --base main
```

---

### staged changes

analyzes only what is staged for commit:

```bash
git diff --staged
```

this is useful for reviewing changes before committing.

---

## logs

ai-tools automatically saves logs of ai responses and errors to your local machine.

logs are stored at:

```bash
~/.config/ai-tools/logs/
```

each execution generates a file with:

* timestamp
* ai response or error details

example structure:

```bash
~/.config/ai-tools/logs/
  ├── review/
  ├── commit/
  ├── error/
```

this is useful for:

* debugging failed requests
* keeping history of generated reviews and commits
* auditing ai outputs

---

## requirements

* node.js 20+
* openrouter api key

---

## tech stack

* typescript
* commander (cli lib)
* axios (http client)

---

## notes

* your api key is never stored, only read from environment variables
* make sure your key is correctly exported in your shell

---

## license

isc
