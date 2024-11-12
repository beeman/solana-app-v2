import { useCluster } from '@/components/cluster/cluster-data-access.tsx'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/web3.js'
import { ReactNode, useMemo } from 'react'
import { SolanaRpcContext } from './solana-rpc-context.tsx'

type Props = Readonly<{
  children: ReactNode
}>

export function SolanaRpcProvider({ children }: Props) {
  const { cluster } = useCluster()

  return (
    <SolanaRpcContext.Provider
      value={useMemo(
        () => ({
          rpc: createSolanaRpc(cluster.endpoint),
          rpcSubscriptions: createSolanaRpcSubscriptions(cluster.endpointSubscriptions),
        }),
        [cluster.endpoint, cluster.endpointSubscriptions],
      )}
    >
      {children}
    </SolanaRpcContext.Provider>
  )
}
