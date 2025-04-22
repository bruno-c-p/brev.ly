import { createLink } from '@/api/create-link'
import type { Link } from '@/api/get-links'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from './button'
import { Input } from './input'

const createLinkFormSchema = z.object({
  originalUrl: z.string().url({ message: 'Informe uma URL válida.' }),
  shortUrl: z
    .string()
    .min(3, { message: 'Informe pelo menos 3 caracteres.' })
    .regex(/^[a-z0-9-]+$/, {
      message:
        'Informe uma url minúscula usando apenas letras, números e hífens.',
    }),
})

type CreateLinkFormSchema = z.infer<typeof createLinkFormSchema>

export function CreateLinkForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLinkFormSchema>({
    resolver: zodResolver(createLinkFormSchema),
    defaultValues: {
      originalUrl: '',
      shortUrl: '',
    },
  })

  const { mutateAsync: createLinkMutation } = useMutation({
    mutationFn: createLink,
    onMutate: async newLink => {
      await queryClient.cancelQueries({ queryKey: ['links'] })
      const previousLinks = queryClient.getQueryData(['links'])
      queryClient.setQueryData(['links'], (oldLinks: Link[] = []) => [
        ...oldLinks,
        newLink,
      ])
      return { previousLinks }
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(['links'], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  async function handleCreateLink(data: CreateLinkFormSchema) {
    try {
      await createLinkMutation({
        originalUrl: data.originalUrl,
        slug: data.shortUrl,
      })
      toast.success('Link encurtado com sucesso!')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao encurtar link!')
    }
  }

  return (
    <form
      className="w-full bg-gray-100 p-6 rounded-lg"
      onSubmit={handleSubmit(handleCreateLink)}
    >
      <fieldset>
        <legend className="text-2xl text-gray-600 font-bold">Novo link</legend>
        <div className="mt-5">
          <Input.Label error={!!errors.originalUrl}>
            LINK ORIGINAL
            <Input.Root
              error={!!errors.originalUrl}
              aria-errormessage={errors.originalUrl?.message}
            >
              <Input.Control
                type="text"
                placeholder="www.exemplo.com.br"
                {...register('originalUrl')}
              />
            </Input.Root>
          </Input.Label>
        </div>

        <div className="mt-5">
          <Input.Label error={!!errors.shortUrl}>
            LINK ENCURTADO
            <Input.Root
              error={!!errors.shortUrl}
              aria-errormessage={errors.shortUrl?.message}
              className="flex items-center gap-1"
            >
              <Input.Prefix>brev.ly/</Input.Prefix>
              <Input.Control type="text" {...register('shortUrl')} />
            </Input.Root>
          </Input.Label>
        </div>
      </fieldset>
      <Button.Root
        type="submit"
        className="mt-6 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar link'}
      </Button.Root>
    </form>
  )
}
