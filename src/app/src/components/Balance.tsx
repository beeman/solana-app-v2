import { useSolanaChain } from '@/components/solana/data-access/solana-chain-context.tsx'
import { useSolanaRpc } from '@/components/solana/data-access/solana-rpc-context.tsx'
import { ErrorDialog } from '@/components/solana/ui/error-dialog.tsx'
import { Text, Tooltip } from '@radix-ui/themes'
import { address } from '@solana/web3.js'
import type { UiWalletAccount } from '@wallet-standard/react'
import { TriangleAlertIcon } from 'lucide-react'
import { useMemo } from 'react'
import useSWRSubscription from 'swr/subscription'
import { getErrorMessage } from '../errors'
import { balanceSubscribe } from '../functions/balance'

type Props = Readonly<{
  account: UiWalletAccount
}>

const seenErrors = new WeakSet()

export function Balance({ account }: Props) {
  const { chain } = useSolanaChain()
  const { rpc, rpcSubscriptions } = useSolanaRpc()
  const subscribe = useMemo(() => balanceSubscribe.bind(null, rpc, rpcSubscriptions), [rpc, rpcSubscriptions])
  const { data: lamports, error } = useSWRSubscription({ address: address(account.address), chain }, subscribe)
  if (error && !seenErrors.has(error)) {
    return (
      <>
        <ErrorDialog
          error={error}
          key={`${account.address}:${chain}`}
          onClose={() => {
            seenErrors.add(error)
          }}
          title="Failed to fetch account balance"
        />
        <Text>
          <Tooltip content={`Could not fetch balance: ${getErrorMessage(error, 'Unknown reason')}`}>
            <TriangleAlertIcon color="red" style={{ height: 16, verticalAlign: 'text-bottom', width: 16 }} />
          </Tooltip>
        </Text>
      </>
    )
  } else if (lamports == null) {
    return <Text>&ndash;</Text>
  } else {
    const formattedSolValue = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(`${lamports}E-9`)
    return <Text>{`${formattedSolValue} \u25CE`}</Text>
  }
}
