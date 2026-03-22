import axios from "axios"
import { getEnv } from "../environments.js"
import { writer } from "../log/index.js"
import { serializeError } from "../log/utils.js"
import type { OpenRouterAxiosError } from "../type/OpenRouterErrorData.js"
import { print } from "../print/print.js"
import { FREE_MODEL_POOLS } from "./models.js"
import pkg from '../../package.json' with { type: 'json' }
import type { AIResponse } from "../type/AIResponse.js"

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
  const pools = [
    { name: 'general', models: FREE_MODEL_POOLS.general },
    { name: 'fallback', models: FREE_MODEL_POOLS.fallback },
    { name: 'cheap', models: FREE_MODEL_POOLS.cheap },
  ]

  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i]!

    try {
      print.info(`trying ${pool.name} pool`)
      return await tryModels(pool.models, prompt)
    } catch (err) {
      const message = (err as Error).message

      if (i < pools.length - 1) {
        print.warn(`${pool.name} failed: ${message}. trying next...`)
      } else {
        print.error(`all pools failed. last error: ${message}`)
      }
    }
  }

  return null
}

export async function askAI(prompt: string) {
  try {
    const result = await requestToAI(prompt)
    if (!result?.content || !result?.model) throw new Error()

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