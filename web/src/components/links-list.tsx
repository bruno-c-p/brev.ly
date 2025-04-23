import { exportLinks } from '@/api/export-links'
import { getLinks } from '@/api/get-links'
import { DownloadSimple, Link, Spinner } from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from './button'
import { LinkItem } from './link-item'

export function LinksList() {
  const { data: links, isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
    refetchInterval: 5000,
  })

  const { mutateAsync: exportLinksMutation, isPending: isExporting } =
    useMutation({
      mutationFn: exportLinks,
      onSuccess: data => {
        window.open(data.reportUrl, '_blank')
        toast.success('Relatório gerado com sucesso!')
      },
      onError: error => {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message || 'Erro ao gerar relatório')
          return
        }
        toast.error('Erro ao gerar relatório')
      },
    })

  async function handleExportLinks() {
    await exportLinksMutation()
  }

  return (
    <section className="w-full bg-gray-100 p-6 rounded-lg flex-1 max-w-96 md:max-w-full h-[396px] relative overflow-y-auto">
      {isLoading && (
        <div className="absolute top-0 left-0 right-0">
          <div className="h-1 w-full bg-gray-200">
            <div className="h-1 w-[30%] bg-blue-base absolute animate-[var(--animate-loading)]" />
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-lg text-gray-600 font-bold">Meus links</h1>
        <Button.Root
          variant="secondary"
          className="max-h-8"
          onClick={handleExportLinks}
          disabled={isExporting || links?.length === 0}
        >
          <Button.Icon>
            {isExporting ? (
              <Spinner size={16} className="animate-spin" />
            ) : (
              <DownloadSimple size={16} />
            )}
          </Button.Icon>
          Baixar CSV
        </Button.Root>
      </div>

      <ul className="mt-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 pt-5 border-t border-gray-200 text-sm mt-5">
            <Spinner size={32} className="text-gray-400 animate-spin" />
            <p className="text-gray-400">Carregando links...</p>
          </div>
        ) : links?.length === 0 ? (
          <p className="text-gray-400 flex flex-col gap-4 pt-5 items-center border-t border-gray-200 text-sm mt-5 uppercase">
            <Link size={32} />
            Ainda não há links cadastrados.
          </p>
        ) : (
          links?.map(link => <LinkItem key={link.slug} link={link} />)
        )}
      </ul>
    </section>
  )
}
