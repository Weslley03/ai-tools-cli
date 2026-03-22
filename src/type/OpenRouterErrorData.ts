import { AxiosError } from 'axios'

export interface OpenRouterErrorData {
  error: {
    message: string
    code: number
  }
  user_id?: string
}

export type OpenRouterAxiosError = AxiosError<OpenRouterErrorData>