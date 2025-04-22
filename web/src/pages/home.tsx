import { Button } from '@/components/button'
import { CreateLinkForm } from '@/components/create-link-form'
import { Logo } from '@/components/logo'
import { Copy } from '@phosphor-icons/react'

export function Home() {
  return (
    <div className="h-dvh bg-gray-200 flex flex-col gap-8 justify-center items-center px-3">
      <Logo />
      <CreateLinkForm />
      <Button.Root variant="secondary">
        <Button.Icon>
          <Copy size={16} />
        </Button.Icon>
        Label
      </Button.Root>
      <Button.Root variant="secondary">
        <Button.Icon>
          <Copy size={16} />
        </Button.Icon>
      </Button.Root>
    </div>
  )
}
