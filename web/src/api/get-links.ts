import { api } from '@/lib/axios'

export interface Link {
  originalUrl: string
  slug: string
  visits: number
}

export async function getLinks() {
  const response = await api.get<Link[]>('/links')
  return response.data
}
