import axios from "axios"
import { print } from "../print/print.js"
import { getEnv } from "../environments.js"
import { writer } from "../log/index.js"
import { serializeError } from "../log/utils.js"

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
          'HTTP-Referer': 'ai-tools cli',
          Authorization: `Bearer ${getEnv('OPENROUTER_API_KEY')}`,
          "Content-Type": "application/json"
        }
      }
    )

    return res.data.choices[0].message.content
  } catch (err) {
    const errorText = serializeError(err)
    await writer("error", errorText)
    throw new Error("openrouter request failed. please check the logs.")
  }
}