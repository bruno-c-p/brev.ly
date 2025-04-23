import { deleteLink } from '@/api/delete-link'
import type { Link } from '@/api/get-links'
import { env } from '@/env'
import { Copy, Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from './button'

interface LinkItemProps {
  link: Link
}

export function LinkItem({ link }: LinkItemProps) {
  const queryClient = useQueryClient()
  const { slug, originalUrl, visits } = link

  const { mutateAsync: deleteLinkMutation } = useMutation({
    mutationFn: deleteLink,
    onMutate: async deletedSlug => {
      await queryClient.cancelQueries({ queryKey: ['links'] })
      const previousLinks = queryClient.getQueryData(['links'])
      queryClient.setQueryData(['links'], (old: Link[] = []) => {
        return old.filter(link => link.slug !== deletedSlug)
      })
      return { previousLinks }
    },
    onError: (_err, _deletedSlug, context) => {
      queryClient.setQueryData(['links'], context?.previousLinks)
      toast.error('Erro ao excluir link!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
    onSuccess: () => {
      toast.success('Link excluído com sucesso!')
    },
  })

  async function handleCopyLink() {
    const shortUrl = `${env.VITE_APP_URL}/${slug}`
    await navigator.clipboard.writeText(shortUrl)
    toast.success('Link copiado para a área de transferência!')
  }

  async function handleDeleteLink() {
    try {
      await deleteLinkMutation(slug)
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message)
        return
      }
      console.error(error)
    }
  }

  return (
    <li className="flex items-center gap-3 py-4 border-t border-gray-200">
      <a
        href={`${env.VITE_APP_URL}/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0"
      >
        <p className="text-blue-base font-medium text-sm line-clamp-1">
          brev.ly/{slug}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">{originalUrl}</p>
      </a>

      <span className="text-xs text-gray-500 mr-5">{visits} acessos</span>

      <div className="flex gap-2">
        <Button.Root
          variant="secondary"
          title="Copiar link"
          onClick={handleCopyLink}
        >
          <Button.Icon>
            <Copy size={16} />
          </Button.Icon>
        </Button.Root>

        <Button.Root
          variant="secondary"
          title="Excluir link"
          className="hover:border-danger"
          onClick={handleDeleteLink}
        >
          <Button.Icon>
            <Trash size={16} />
          </Button.Icon>
        </Button.Root>
      </div>
    </li>
  )
}
