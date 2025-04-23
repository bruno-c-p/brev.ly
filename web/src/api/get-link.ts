import { api } from '@/lib/axios'

interface GetLinkResponse {
  originalUrl: string
}

export async function getLink(slug: string) {
  const response = await api.get<GetLinkResponse>(`/${slug}`)
  return response.data
}
