import { DropdownMenuItem } from '@/components/ui/dropdown-menu.tsx'
import type { UiWallet } from '@wallet-standard/react'
import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { ErrorDialog } from './error-dialog.tsx'
import { WalletMenuItemContent } from './wallet-menu-item-content.tsx'

type Props = Readonly<{
  error: unknown
  wallet: UiWallet
}>

export function UnconnectableWalletMenuItem({ error, wallet }: Props) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  return (
    <>
      <DropdownMenuItem disabled onClick={() => setDialogIsOpen(true)}>
        <WalletMenuItemContent wallet={wallet}>
          <div style={{ textDecoration: 'line-through' }}>{wallet.name}</div>
        </WalletMenuItemContent>
        <div className="rt-BaseMenuShortcut rt-DropdownMenuShortcut">
          <TriangleAlert
            className="rt-BaseMenuSubTriggerIcon rt-DropdownMenuSubtriggerIcon"
            style={{ height: 14, width: 14 }}
          />
        </div>
      </DropdownMenuItem>
      {dialogIsOpen ? (
        <ErrorDialog error={error} onClose={() => setDialogIsOpen(false)} title="Unconnectable wallet" />
      ) : null}
    </>
  )
}
