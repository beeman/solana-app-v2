import { Button } from '@/components/ui/button.tsx'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import { Trash } from 'lucide-react'
import { FormEvent, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClusterNetwork, useCluster } from './cluster-data-access'

export function ExplorerLink({ path, label, className }: { path: string; label: string; className?: string }) {
  const { getExplorerUrl } = useCluster()
  return (
    <a
      href={getExplorerUrl(path)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  )
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  return children
  //   const { cluster } = useCluster()
  //   const { connection } = useConnection()
  //
  //   const query = useQuery({
  //     queryKey: ['version', { cluster, endpoint: connection.rpcEndpoint }],
  //     queryFn: () => connection.getVersion(),
  //     retry: 1,
  //   })
  //   if (query.isLoading) {
  //     return null
  //   }
  //   if (query.isError || !query.data) {
  //     return (
  //       <div className="alert alert-warning text-warning-content/80 rounded-none flex justify-center">
  //         <span>
  //           Error connecting to cluster <strong>{cluster.name}</strong>
  //         </span>
  //         <button className="btn btn-xs btn-neutral" onClick={() => query.refetch()}>
  //           Refresh
  //         </button>
  //       </div>
  //     )
  //   }
  //   return children
}

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm">{cluster.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {clusters.map((item) => (
          <DropdownMenuItem key={item.name} onClick={() => setCluster(item)}>
            {item.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={'/clusters'}>Manage clusters</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ClusterUiModal() {
  const [open, setOpen] = useState(false)
  const { addCluster } = useCluster()
  const [name, setName] = useState('')
  const [network, setNetwork] = useState<ClusterNetwork | undefined>()
  const [endpoint, setEndpoint] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOpen(false)
    if (!name.length || !endpoint.length) {
      console.log('Invalid cluster name or endpoint')
      return
    }
    // FIXME: Add back endpoint validation. Move to cluster-data-access.
    //         try {
    //           new Connection(endpoint)
    //           if (name) {
    //             addCluster({ name, network, endpoint })
    //             hideModal()
    //           } else {
    //             console.log('Invalid cluster name')
    //           }
    //         } catch {
    //           console.log('Invalid cluster endpoint')
    //         }

    addCluster({
      name,
      network,
      endpoint,
      // FIXME: Move as default option to cluster-data-access, add form field for endpointSubscriptions
      endpointSubscriptions: endpoint.replace('https://', 'wss://').replace('http://', 'ws://'),
    })
    setName('')
    setEndpoint('')
    setNetwork(undefined)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Cluster</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Cluster</DialogTitle>
        <DialogDescription>Add a new cluster to your list of clusters.</DialogDescription>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Label htmlFor="cluster-name">Cluster name</Label>
          <Input
            id="cluster-name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Label htmlFor="cluster-endpoint">Endpoint</Label>
          <Input
            id="cluster-endpoint"
            type="text"
            placeholder="Endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />

          <Label htmlFor="cluster-network">Network</Label>
          <Select
            value={network}
            onValueChange={(value) => setNetwork(value?.length ? (value as ClusterNetwork) : undefined)}
          >
            <SelectTrigger id="cluster-network">
              <SelectValue placeholder="Select a network" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ClusterNetwork.Custom}>Custom</SelectItem>
                <SelectItem value={ClusterNetwork.Devnet}>Devnet</SelectItem>
                <SelectItem value={ClusterNetwork.Testnet}>Testnet</SelectItem>
                <SelectItem value={ClusterNetwork.Mainnet}>Mainnet</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="text-right">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ClusterUiTable() {
  const { clusters, setCluster, deleteCluster } = useCluster()
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="w-[100px]">Endpoint</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clusters.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">
                <Button
                  variant="secondary"
                  disabled={item.active}
                  title="Select cluster"
                  className="link link-secondary"
                  onClick={() => setCluster(item)}
                >
                  {item.name}
                </Button>
              </TableCell>
              <TableCell className="whitespace-nowrap text-gray-500 text-xs">{item.endpoint}</TableCell>
              <TableCell className="text-right">
                <Button
                  disabled={item?.active}
                  variant="destructive"
                  onClick={() => {
                    if (!window.confirm('Are you sure?')) return
                    deleteCluster(item)
                  }}
                >
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
