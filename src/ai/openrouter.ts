import axios from "axios"
import { print } from "../print/print.js"
import { getEnv } from "../environments.js"
import { writer } from "../log/index.js"
import { serializeError } from "../log/utils.js"
import type { OpenRouterAxiosError } from "../type/OpenRouterErrorData.js"
import { print } from "../print/print.js"

const model = 'openrouter/hunter-alpha'

export async function askAI(prompt: string) {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          'HTTP-Referer': 'ai-tools-cli',
          'X-OpenRouter-Title': 'ai-tools-cli',
          Authorization: `Bearer ${getEnv('OPENROUTER_API_KEY')}`,
          "Content-Type": "application/json"
        }
      }
    )

    return res.data.choices[0].message.content
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