import { api } from '@/lib/axios'

interface CreateLinkBody {
  originalUrl: string
  slug: string
}

export async function createLink({ originalUrl, slug }: CreateLinkBody) {
  await api.post('/links', {
    originalUrl,
    slug,
  })
}
