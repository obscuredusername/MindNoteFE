import { api } from '@/lib/api'

export interface CommandRequest {
    text: string
    timezone_offset: number
}

export interface ResearchResult {
    title: string
    content: string
}

export const aiService = {
    command: (payload: CommandRequest) => api.post('/ai/command', payload),
    voiceCommand: (formData: FormData) => api.post('/ai/voice-command', formData),
    research: (query: string) => api.post<ResearchResult[]>('/ai/research', { query }),
    summarize: (text: string) => api.post<{ summary: string }>('/ai/summarize', { text }),
}
