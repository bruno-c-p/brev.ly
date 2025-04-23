import { api } from '@/lib/axios'

interface ExportLinksResponse {
  reportUrl: string
}

export async function exportLinks() {
  const response = await api.get<ExportLinksResponse>('/links/export')
  return response.data
}
