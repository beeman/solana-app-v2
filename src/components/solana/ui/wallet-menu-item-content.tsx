import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import type { UiWallet } from '@wallet-standard/react'
import React from 'react'

type Props = Readonly<{
  children?: React.ReactNode
  loading?: boolean
  wallet: UiWallet
}>

export function WalletMenuItemContent({ children, wallet }: Props) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <Avatar className="h-6 w-6">
        <AvatarImage src={wallet.icon} alt={wallet.name} />
        <AvatarFallback>{wallet.name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <span>{children ?? wallet.name}</span>
    </div>
  )
}
