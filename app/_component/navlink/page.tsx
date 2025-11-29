'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

export default function NavLink({
  children,
  href,
  className,
  ...props
}: {
  children: React.ReactNode
  href: string
  className?: string
} & React.ComponentProps<typeof Link>) {
  const path = usePathname()
  const isActive = path === href

  return (
    <Link
      href={href}
      data-active={isActive ? 'true' : undefined}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}
