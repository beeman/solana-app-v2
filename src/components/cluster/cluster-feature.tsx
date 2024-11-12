import { AppHero } from '@/components/app-layout.tsx'
import { ClusterUiModal, ClusterUiTable } from './cluster-ui'

export default function ClusterFeature() {
  return (
    <div>
      <AppHero title="Clusters" subtitle="Manage and select your Solana clusters">
        <ClusterUiModal />
      </AppHero>
      <ClusterUiTable />
    </div>
  )
}
