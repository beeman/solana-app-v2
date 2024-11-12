import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useState } from 'react'

import { getErrorMessage } from '../../errors.tsx'

type Props = Readonly<{
  error: unknown
  onClose?(): false | void
  title?: string
}>

export function ErrorDialog({ error, onClose, title }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (!onClose || onClose() !== false) {
            setIsOpen(false)
          }
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogTitle color="red">{title ?? 'We encountered the following error'}</AlertDialogTitle>
        <AlertDialogDescription>
          <blockquote>{getErrorMessage(error, 'Unknown')}</blockquote>
        </AlertDialogDescription>
        <div className="flex justify-end mt-4">
          <AlertDialogAction asChild>
            <Button variant="secondary">Close</Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
