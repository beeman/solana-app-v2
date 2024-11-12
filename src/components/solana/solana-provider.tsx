import { SolanaChainProvider } from '@/components/solana/data-access/solana-chain-provider.tsx'
import { SolanaRpcProvider } from '@/components/solana/data-access/solana-rpc-provider.tsx'
import { SolanaWalletProvider } from '@/components/solana/data-access/solana-wallet-provider.tsx'
import { ReactNode } from 'react'

export function SolanaProvider({ children }: { children: ReactNode }) {
  return (
    <SolanaChainProvider>
      <SolanaWalletProvider>
        <SolanaRpcProvider>{children}</SolanaRpcProvider>
      </SolanaWalletProvider>
    </SolanaChainProvider>
  )
}
