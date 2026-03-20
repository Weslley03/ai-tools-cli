import { getGitDiff } from "../git/gitMethods.js"
import { askAI } from "../ai/openrouter.js"
import { commitPrompt } from "../ai/prompts.js"
import { print } from "../print/print.js"
import { writer } from "../log/index.js"
import ora from "ora"

export async function commitCommand(options: { base?: string; staged?: boolean }): Promise<void> {

  const diff = getGitDiff({
    base: options.base,
    staged: options.staged
  })

  if (!diff.trim()) {
    print.warn("no changes detected. make your commit.")
    return
  }

  const prompt = commitPrompt(diff)

  const spinner = ora("thinking about your code...").start()

  try {
    const message = await askAI(prompt)

    spinner.succeed("git message built")

    await writer("commit", message)
    print.result(message)
  } catch (err) {
    spinner.fail("failed to generate commit messages")
    throw err
  }
}