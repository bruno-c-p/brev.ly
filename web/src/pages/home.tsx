import { CreateLinkForm } from '@/components/create-link-form'
import { LinksList } from '@/components/links-list'
import { Logo } from '@/components/logo'

export function Home() {
  return (
    <main className="h-dvh bg-gray-200 flex justify-center items-center px-3">
      <div className="w-full flex flex-col gap-8 items-center md:items-start max-w-[980px]">
        <Logo />
        <div className="flex flex-col gap-5 items-center md:items-start md:flex-row w-full">
          <CreateLinkForm />
          <LinksList />
        </div>
      </div>
    </main>
  )
}
