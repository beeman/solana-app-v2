import { useSolanaWallet } from '@/components/solana/data-access/solana-wallet-context.tsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { StandardConnect, StandardDisconnect } from '@wallet-standard/core'
import type { UiWallet } from '@wallet-standard/react'
import { uiWalletAccountBelongsToUiWallet, useWallets } from '@wallet-standard/react'
import { ReactNode, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ConnectWalletMenuItem } from './connect-wallet-menu-item.tsx'
import { ErrorDialog } from './error-dialog.tsx'
import { UnconnectableWalletMenuItem } from './unconnectable-wallet-menu-item.tsx'
import { WalletAccountIcon } from './wallet-account-icon.tsx'

type Props = Readonly<{
  children: ReactNode
}>

export function ConnectWalletMenu({ children }: Props) {
  const { current: NO_ERROR } = useRef(Symbol())
  const wallets = useWallets()
  const [selectedWalletAccount, setSelectedWalletAccount] = useSolanaWallet()
  const [error, setError] = useState(NO_ERROR)
  const [forceClose, setForceClose] = useState(false)
  function renderItem(wallet: UiWallet) {
    return (
      <ErrorBoundary
        fallbackRender={({ error }) => <UnconnectableWalletMenuItem error={error} wallet={wallet} />}
        key={`wallet:${wallet.name}`}
      >
        <ConnectWalletMenuItem
          onAccountSelect={(account) => {
            setSelectedWalletAccount(account)
            setForceClose(true)
          }}
          onDisconnect={(wallet) => {
            if (selectedWalletAccount && uiWalletAccountBelongsToUiWallet(selectedWalletAccount, wallet)) {
              setSelectedWalletAccount(undefined)
            }
          }}
          onError={setError}
          wallet={wallet}
        />
      </ErrorBoundary>
    )
  }
  const walletsThatSupportStandardConnect = []
  const unconnectableWallets = []
  for (const wallet of wallets) {
    if (wallet.features.includes(StandardConnect) && wallet.features.includes(StandardDisconnect)) {
      walletsThatSupportStandardConnect.push(wallet)
    } else {
      unconnectableWallets.push(wallet)
    }
  }
  return (
    <>
      <DropdownMenu open={forceClose ? false : undefined} onOpenChange={setForceClose.bind(null, false)}>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            {selectedWalletAccount ? (
              <>
                <WalletAccountIcon account={selectedWalletAccount} width="18" height="18" />
                {selectedWalletAccount.address.slice(0, 8)}
              </>
            ) : (
              children
            )}
            {/*<DropdownMenu.TriggerIcon />*/}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex flex-col gap-2">
            {wallets.length === 0 ? (
              <Alert color="orange">
                <AlertTitle>No wallets installed</AlertTitle>
                <AlertDescription>This browser has no wallets installed.</AlertDescription>
              </Alert>
            ) : (
              <>
                {walletsThatSupportStandardConnect.map(renderItem)}
                {unconnectableWallets.length ? (
                  <>
                    <DropdownMenuSeparator />
                    {unconnectableWallets.map(renderItem)}
                  </>
                ) : null}
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {error !== NO_ERROR ? <ErrorDialog error={error} onClose={() => setError(NO_ERROR)} /> : null}
    </>
  )
}
