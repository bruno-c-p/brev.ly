import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="h-dvh bg-gray-200 flex justify-center items-center px-3">
      <div className="w-full max-w-[480px] bg-white rounded-lg p-8 text-center">
        <img src="/404.svg" alt="404" className="h-14 mx-auto" />

        <h2 className="text-2xl font-bold text-gray-600 mt-6">
          Link não encontrado
        </h2>

        <p className="text-gray-500 text-sm  mt-6">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{' '}
          <Link to="/" className="text-blue-base hover:underline">
            brev.ly
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
