import path from "node:path"
import { promises as fs } from "fs"
import type { LogType } from "../type/LogType.ts"
import { print } from "../print/print.js"
import os from "node:os"

/** internal method for writing logs. */
export async function writer(type: LogType, result: string) {
  try {
    const logsDir = path.join(os.homedir(), ".config", "ai-tools", "logs", type)

    await fs.mkdir(logsDir, { recursive: true })

    const fileName = `${type}-${new Date().toISOString().replace(/:/g, "-")}.txt`
    const filePath = path.join(logsDir, fileName)

    const logContent = `
      time: ${new Date().toISOString()}
      
      response:
      ${result}
    `
    await fs.writeFile(filePath, logContent, "utf-8")
  } catch (err) {
    print.error(`was not possible to write the logs. ${err}`)
  }
}