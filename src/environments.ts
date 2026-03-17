export type Envs =
  | "OPENROUTER_API_KEY"

export function getEnv(env: Envs): string {
  const value = process.env[env]

  if (!value) {
    throw new Error(`
      missing environment variable: ${env}

      add it to your shell:

      export ${env}=your_key_here
    `)
  }

  return value
}