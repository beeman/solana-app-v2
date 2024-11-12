import { AppHero } from '@/components/app-layout.tsx'
import { useSolanaWallet } from '@/components/solana/data-access/solana-wallet-context.tsx'
import { ConnectWalletMenu } from '@/components/solana/ui/connect-wallet-menu.tsx'
import { Navigate } from 'react-router'

export default function AccountListFeature() {
  const [selectedWalletAccount] = useSolanaWallet()

  if (selectedWalletAccount?.address) {
    return <Navigate replace to={`./${selectedWalletAccount.address}`} />
  }

  return (
    <AppHero>
      <ConnectWalletMenu>Connect Wallet</ConnectWalletMenu>
    </AppHero>
  )
}
