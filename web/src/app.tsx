import { queryClient } from '@/lib/react-query'
import { Home } from '@/pages/home'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <Home />
    </QueryClientProvider>
  )
}
