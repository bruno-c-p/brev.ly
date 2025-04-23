import { api } from '@/lib/axios'

export async function deleteLink(slug: string) {
  await api.delete(`/links/${slug}`)
}
