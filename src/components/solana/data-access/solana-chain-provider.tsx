import { mainnet, testnet } from '@solana/web3.js'
import { ReactNode, useMemo, useState } from 'react'

import { DEFAULT_CHAIN_CONFIG, SolanaChainContext, SolanaChainContextProps } from './solana-chain-context.tsx'

const STORAGE_KEY = 'solana-example-react-app:selected-chain'

export function SolanaChainProvider({ children }: { children: ReactNode }) {
  const [chain, setChain] = useState(() => localStorage.getItem(STORAGE_KEY) ?? 'solana:devnet')
  const contextValue = useMemo<SolanaChainContextProps>(() => {
    switch (chain) {
      // @ts-expect-error Intentional fall through
      case 'solana:mainnet':
        if (process.env.REACT_EXAMPLE_APP_ENABLE_MAINNET === 'true') {
          return {
            chain: 'solana:mainnet',
            displayName: 'Mainnet Beta',
            solanaExplorerClusterName: 'mainnet-beta',
            solanaRpcSubscriptionsUrl: mainnet('wss://api.mainnet-beta.solana.com'),
            solanaRpcUrl: mainnet('https://api.mainnet-beta.solana.com'),
          }
        }
      // falls through
      case 'solana:testnet':
        return {
          chain: 'solana:testnet',
          displayName: 'Testnet',
          solanaExplorerClusterName: 'testnet',
          solanaRpcSubscriptionsUrl: testnet('wss://api.testnet.solana.com'),
          solanaRpcUrl: testnet('https://api.testnet.solana.com'),
        }
      case 'solana:devnet':
      default:
        if (chain !== 'solana:devnet') {
          localStorage.removeItem(STORAGE_KEY)
          console.error(`Unrecognized chain \`${chain}\``)
        }
        return DEFAULT_CHAIN_CONFIG
    }
  }, [chain])
  return (
    <SolanaChainContext.Provider
      value={useMemo(
        () => ({
          ...contextValue,
          setChain(chain) {
            localStorage.setItem(STORAGE_KEY, chain)
            setChain(chain)
          },
        }),
        [contextValue],
      )}
    >
      {children}
    </SolanaChainContext.Provider>
  )
}
