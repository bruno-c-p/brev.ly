import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

const button = tv({
  base: 'outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer flex items-center justify-center gap-2',
  variants: {
    variant: {
      primary:
        'bg-blue-base hover:bg-blue-dark text-white focus:ring-blue-base rounded-lg h-12 text-sm/7 px-4',
      secondary:
        'border border-transparent bg-gray-200 text-gray-500 focus:ring-blue-base-300 rounded-sm text-xs/6 hover:border-blue-base transition-colors p-2',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

interface ButtonRootProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
}

function ButtonRoot({
  children,
  className,
  variant,
  ...props
}: ButtonRootProps) {
  return (
    <button className={button({ variant, className })} {...props}>
      {children}
    </button>
  )
}

interface ButtonIconProps extends ComponentProps<'span'> {}

function ButtonIcon({ className, ...props }: ButtonIconProps) {
  return (
    <span
      className={twMerge('flex items-center text-gray-600', className)}
      {...props}
    />
  )
}

export const Button = {
  Root: ButtonRoot,
  Icon: ButtonIcon,
}
