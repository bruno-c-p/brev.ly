import { getLink } from '@/api/get-link'
import { Logo } from '@/components/logo'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { NotFound } from './not-found'

export function Redirect() {
  const { slug } = useParams<{ slug: string }>() || {}

  if (!slug) {
    return <NotFound />
  }

  const { isLoading, data } = useQuery({
    queryKey: ['redirect', slug],
    queryFn: () => getLink(slug),
    retry: false,
  })

  useEffect(() => {
    if (data?.originalUrl) {
      window.location.href = data.originalUrl
    }
  }, [data])

  if (isLoading) {
    return (
      <main className="h-dvh bg-gray-200 flex justify-center items-center px-3">
        <div className="w-full max-w-[480px] bg-white rounded-lg p-8 text-center">
          <div className="flex justify-center">
            <Logo className="w-48" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mt-8">
            Redirecionando...
          </h2>

          <p className="text-gray-500 mt-4">
            Você será redirecionado para o link original em instantes.
          </p>
        </div>
      </main>
    )
  }

  return <NotFound />
}
