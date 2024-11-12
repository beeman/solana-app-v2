import { AppRoutes } from '@/app/app-routes.tsx'
import { ClusterProvider } from '@/components/cluster/cluster-data-access.tsx'
import { SolanaProvider } from '@/components/solana/solana-provider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={client}>
      <ClusterProvider>
        <SolanaProvider>
          <AppRoutes />
        </SolanaProvider>
      </ClusterProvider>
    </QueryClientProvider>
  )
}
