import { ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-center font-bold text-lg',
        props.className
      )}
    >
      <span className="text-primary">El Árbol Mágico</span>
    </div>
  )
}
