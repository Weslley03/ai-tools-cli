import { execSync } from "node:child_process"
import { print } from "../print/print.js"

/** 
 * returns the git diff based on the provided options.
 * 
 * - if `staged` is true, returns diff of staged changes
 * - otherwise, compares current branch against a base branch
 *   (custom base or auto-detected)
 */
export function getGitDiff(options?: { base: string | undefined; staged: boolean | undefined }): string {
  try {
    let command = ""

    if (options?.staged && options.base) {
      throw new Error("cannot use --staged and --base together")
    }

    if (options?.staged) {
      command = "git diff --staged"
    } else {
      const baseBranch = options?.base || getBaseBranch()
      command = `git diff ${baseBranch}...HEAD`
    }

    const diff = execSync(command, {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 10
    })

    return diff
  } catch {
    throw new Error("failed to read git diff.")
  }
}

/**
 * attempts to detect a base branch from common defaults.
 * used when no custom base is provided.
 */
function getBaseBranch(): string {
  try {
    const upstream = execSync(
      "git rev-parse --abbrev-ref HEAD@{upstream}",
      { encoding: "utf8" }
    ).trim()

    return upstream.split("/")[1] || upstream
  } catch {
    const branches = ["master", "staging", "development"]

    for (const branch of branches) {
      try {
        execSync(`git rev-parse ${branch}`, { stdio: "ignore" })
        return branch
      } catch { }
    }

    return "main"
  }
}