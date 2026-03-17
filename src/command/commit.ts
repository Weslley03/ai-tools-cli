import { getGitDiff } from "../git/gitMethods.js"
import { askAI } from "../ai/openrouter.js"
import { commitPrompt } from "../ai/prompts.js"
import { print } from "../print/print.js"
import { writer } from "../log/index.js"

export async function commitCommand() {

  const diff = getGitDiff()

  if (!diff) {
    print.warn("no changes detected.")
    return
  }

  const prompt = commitPrompt(diff)

  const message = await askAI(prompt)
  await writer("commit", message)

  print.result(message)
}