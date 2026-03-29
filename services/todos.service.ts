import { api } from '@/lib/api'
import type { Todo } from '@/lib/app-store'

export const todosService = {
    list: () => api.get<Todo[]>('/writer/todos'),
    create: (todo: Partial<Todo>) => api.post<Todo>('/writer/todos', todo),
    update: (id: string, updates: Partial<Todo>) => api.patch<Todo>(`/writer/todos/${id}`, updates),
    remove: (id: string) => api.delete(`/writer/todos/${id}`),
}
