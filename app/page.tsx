import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { Dashboard } from '@/components/qms-views'
import { isUnauthenticatedDemoMode } from '@/lib/demo-mode'

export default async function Home() {
  if (!isUnauthenticatedDemoMode()) {
    const { auth } = await import('@/lib/auth')
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect('/sign-in')
  }
  return <AppShell><Dashboard /></AppShell>
}
