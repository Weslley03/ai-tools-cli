import axios from "axios"
import { getEnv } from "../environments.js"
import { writer } from "../log/index.js"
import { serializeError } from "../log/utils.js"
import type { OpenRouterAxiosError } from "../type/OpenRouterErrorData.js"
import { print } from "../print/print.js"
import pkg from '../../package.json' with { type: 'json' }
import type { AIResponse } from "../type/AIResponse.js"
import { getActivePools } from "../config/loader.js"

const version = pkg.version

async function tryModels(models: string[], prompt: string): Promise<AIResponse> {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      models,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        'HTTP-Referer': 'https://github.com/weslley03/ai-tools-cli',
        'X-OpenRouter-Title': `ai-tools-cli@${version}`,
        Authorization: `Bearer ${getEnv('OPENROUTER_API_KEY')}`,
        "Content-Type": "application/json"
      }
    }
  )

  return {
    content: res.data.choices[0].message.content,
    model: res.data.model
  }
}

async function requestToAI(prompt: string): Promise<AIResponse | null> {
  const pools = getActivePools()

  const entries = (["general", "fallback", "cheap"] as const)
    .map(name => ({ name, models: pools[name] }))
    .filter(p => p.models?.length > 0)

  for (let i = 0; i < entries.length; i++) {
    const pool = entries[i]!

    try {
      print.info(`trying ${pool.name} pool`)
      return await tryModels(pool.models, prompt)
    } catch (err) {
      const message = (err as Error).message
      const isLast = i === entries.length - 1

      isLast
        ? print.error(`all pools failed. last error: ${message}`)
        : print.warn(`${pool.name} failed: ${message}. trying next...`)
      }
  }

  return null
}

export async function askAI(prompt: string) {
  try {
    const result = await requestToAI(prompt)
    if (!result?.content || !result?.model) throw new Error('empty response')

    print.info(`result by model: ${result.model}`)
    return result.content
  } catch (err) {
    const error = err as OpenRouterAxiosError
    const message = error.response?.data?.error?.message ?? "openrouter request failed"
    
    print.error("openrouter request failed. for more details, please check the logs.")
    print.error(message)

    const errorText = serializeError(err)
    await writer("error", errorText)

    return null
  }
}