import { Button } from '@/components/ui/button.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import type { UiWallet } from '@wallet-standard/react'
import { useDisconnect } from '@wallet-standard/react'
import { LogOutIcon, TriangleAlertIcon } from 'lucide-react'
import { ComponentProps, useState } from 'react'

import { NO_ERROR } from '../../errors.tsx'

type Props = Readonly<{
  wallet: UiWallet
}>

export function DisconnectButton({
  wallet,
  ...buttonProps
}: Omit<ComponentProps<typeof Button>, 'color' | 'loading' | 'onClick'> & Props) {
  const [isDisconnecting, disconnect] = useDisconnect(wallet)
  const [lastError, setLastError] = useState<unknown | typeof NO_ERROR>(NO_ERROR)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...buttonProps}
          color="red"
          disabled={isDisconnecting}
          onClick={async () => {
            setLastError(NO_ERROR)
            try {
              await disconnect()
            } catch (e) {
              setLastError(e)
            }
          }}
          variant="outline"
        >
          {lastError === NO_ERROR ? <LogOutIcon /> : <TriangleAlertIcon />}
          Disconnect
        </Button>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <>
          Error:{' '}
          {lastError && typeof lastError === 'object' && 'message' in lastError
            ? lastError['message']
            : String(lastError)}
        </>
      </TooltipContent>
    </Tooltip>

    // <Tooltip
    //   content={
    //     <>
    //       Error:{' '}
    //       {lastError && typeof lastError === 'object' && 'message' in lastError ? lastError.message : String(lastError)}
    //     </>
    //   }
    //   open={lastError !== NO_ERROR}
    //   side="left"
    // >
    //
    // </Tooltip>
  )
}
