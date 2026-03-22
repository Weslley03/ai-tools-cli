import { getGitDiff } from "../git/gitMethods.js"
import { askAI } from "../ai/openrouter.js"
import { print } from "../print/print.js"
import { writer } from "../log/index.js"
import ora from "ora"
import { buildPrompt } from "../config/loader.js"

export async function commitCommand(options: { base?: string; staged?: boolean }): Promise<void> {

  const diff = getGitDiff({
    base: options.base,
    staged: options.staged
  })

  if (!diff.trim()) {
    print.warn("no changes detected. make your commit.")
    return
  }

  const prompt = buildPrompt("commit", { diff })

  const spinner = ora("thinking about your code...").start()

  const message = await askAI(prompt)

  if (!message) {
    spinner.fail("failed to generate commit messages")
    return
  }

  spinner.succeed("git message built")

  await writer("commit", message)
  print.result(message)
}