import { readFileSync } from "fs"
import type { AIConfig, PoolConfig } from "../type/Configs.js"
import path from "node:path"
import { fileURLToPath } from "url"

let _config: AIConfig | null = null

export function loadConfig(): AIConfig {
  if (_config) return _config

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const configPath = path.resolve(__dirname, "../../config/ai.config.json")

  try {
    const raw = readFileSync(configPath, "utf-8")
    _config = JSON.parse(raw) as AIConfig
    return _config
  } catch {
    throw new Error(`failed to load config at ${configPath}. make sure the file exists.`)
  }
}

export function getActivePools(): PoolConfig {
  const config = loadConfig()
  return config.models[config.mode].pools
}

export function buildPrompt(name: string, vars: Record<string, string>): string {
  const config = loadConfig()
  const prompt = config.prompts[name]

  if (!prompt) throw new Error(`prompt "${name}" not found in config.`)

  const filled = Object.entries(vars).reduce(
    (tpl, [key, value]) => tpl.replaceAll(`{{${key}}}`, value),
    prompt.template
  )

  return `${prompt.system}\n\n${filled}`
}
