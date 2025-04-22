import { Warning } from '@phosphor-icons/react'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

const input = tv({
  base: 'border text-gray-600 rounded-lg px-4 py-2 text-sm/7 outline-none placeholder:text-gray-400 font-normal focus-within:ring-1',
  variants: {
    error: {
      true: 'border-danger focus-within:ring-danger focus-within:border-danger',
      false:
        'border-gray-300 focus-within:ring-blue-base focus-within:border-blue-base',
    },
  },
  defaultVariants: {
    error: false,
  },
})
interface InputRootProps extends ComponentProps<'div'> {
  error?: boolean
}

function InputRoot({ children, error, className, ...props }: InputRootProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className={input({ error, className })} {...props}>
        {children}
      </div>
      {error && (
        <span className="text-xs text-gray-500 flex items-center gap-1 font-normal">
          <Warning size={16} className="text-danger" />
          {props['aria-errormessage']}
        </span>
      )}
    </div>
  )
}

interface InputControlProps extends ComponentProps<'input'> {
  error?: boolean
}

function InputControl({ className, ...props }: InputControlProps) {
  return (
    <input
      className={twMerge(
        'text-gray-600 text-sm/7 outline-none placeholder:text-gray-400 font-normal w-full',
        className
      )}
      {...props}
    />
  )
}

interface InputPrefixProps extends ComponentProps<'span'> {}

function InputPrefix({ className, ...props }: InputPrefixProps) {
  return (
    <span
      className={twMerge('text-sm/7 text-gray-400 font-normal', className)}
      {...props}
    />
  )
}

interface InputLabelProps extends ComponentProps<'label'> {
  error?: boolean
}

function InputLabel({ className, error, ...props }: InputLabelProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label
      className={twMerge(
        'text-[10px] flex flex-col gap-2 text-gray-500 focus-within:text-blue-base focus-within:font-bold',
        className,
        error && 'focus-within:text-danger focus-within:font-bold'
      )}
      {...props}
    />
  )
}

export const Input = {
  Root: InputRoot,
  Control: InputControl,
  Prefix: InputPrefix,
  Label: InputLabel,
}
