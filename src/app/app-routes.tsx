import { AppDemo } from '@/app/app-demo-dialog.tsx'
import { AppLayout } from '@/components/app-layout.tsx'
import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

const AccountListFeature = lazy(() => import('../components/account/account-list-feature.tsx'))
const AccountDetailFeature = lazy(() => import('../components/account/account-detail-feature.tsx'))
const ClusterFeature = lazy(() => import('../components/cluster/cluster-feature.tsx'))
const DashboardFeature = lazy(() => import('../components/dashboard/dashboard-feature.tsx'))

const links: { label: string; path: string }[] = [
  //
  { label: 'Account', path: '/account' },
]

const routes: RouteObject[] = [
  { path: '/account/', element: <AccountListFeature /> },
  { path: '/account/:address', element: <AccountDetailFeature /> },
  { path: '/clusters', element: <ClusterFeature /> },
  { path: '/demo', element: <AppDemo /> },
]

export function AppRoutes() {
  return (
    <AppLayout links={links}>
      {useRoutes([
        { index: true, element: <Navigate to={'/dashboard'} replace={true} /> },
        { path: '/dashboard', element: <DashboardFeature /> },
        ...routes,
        { path: '*', element: <Navigate to={'/dashboard'} replace={true} /> },
      ])}
    </AppLayout>
  )
}
