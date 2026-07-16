import type { SyntheticEvent } from 'react'

const PLACEHOLDER = 'https://placehold.co/400x300?text=Sin+Imagen'

interface SmartImageProps {
  readonly src?: string
  readonly alt: string
  readonly className?: string
}

export default function SmartImage({ src, alt, className }: SmartImageProps) {
  return (
    <img
      src={src || PLACEHOLDER}
      alt={alt}
      className={`${className ?? ''} object-contain object-center`}
      onError={(e: SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = PLACEHOLDER
      }}
    />
  )
}
