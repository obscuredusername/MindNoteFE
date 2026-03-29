import { api } from '@/lib/api'
import type { Reminder } from '@/lib/app-store'

export const remindersService = {
    list: () => api.get<Reminder[]>('/writer/reminders'),
    create: (reminder: Partial<Reminder>) => api.post<Reminder>('/writer/reminders', reminder),
    update: (id: string, updates: Partial<Reminder>) => api.patch<Reminder>(`/writer/reminders/${id}`, updates),
    remove: (id: string) => api.delete(`/writer/reminders/${id}`),
}
