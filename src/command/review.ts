import { getGitDiff } from "../git/gitMethods.js"
import { askAI } from "../ai/openrouter.js"
import { print } from "../print/print.js"
import { writer } from "../log/index.js"
import ora from "ora"
import { buildPrompt } from "../config/loader.js"

export async function reviewCommand(options: { base?: string; staged?: boolean }): Promise<void> {

  const diff = getGitDiff({
    base: options.base,
    staged: options.staged
  })

  if (!diff.trim()) {
    print.warn("no changes found to review. make your commit.")
    return
  }

  const prompt = buildPrompt("review", { diff })

  const spinner = ora("thinking about your code...").start()

  const review = await askAI(prompt)

  if (!review) {
    spinner.fail("failed to generate review")
    return
  }

  spinner.succeed("review completed")

  await writer("review", review)
  print.result(review)
}