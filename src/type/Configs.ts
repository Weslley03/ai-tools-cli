export interface PoolConfig {
  general: string[]
  fallback: string[]
  cheap: string[]
}

export interface ModeConfig {
  pools: PoolConfig
}

export interface PromptConfig {
  system: string
  template: string
}

export interface AIConfig {
  mode: "free" | "pro"
  models: {
    free: ModeConfig
    pro: ModeConfig
  }
  prompts: Record<string, PromptConfig>
}