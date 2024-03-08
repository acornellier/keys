import { ReactNode } from 'react'

interface Props {
  row?: boolean
  children: ReactNode
  className?: string
  blue?: boolean
}

export function Panel({ row, children, className, blue }: Props) {
  return (
    <div className={`relative border-2 border-gray-500 rounded-md flex gap-2 ${className ?? ''}`}>
      <div
        className={`gritty absolute w-full h-full bg-gray-950 opacity-85 z-[-1] ${
          blue ? 'bg-fancy-blue' : ''
        }`}
      />
      <div className={`flex ${row ? '' : 'flex-col'} gap-2 p-2 w-full ${className ?? ''}`}>
        {children}
      </div>
    </div>
  )
}
