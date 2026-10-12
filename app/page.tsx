import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { Dashboard } from '@/components/qms-views'
import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <AppShell><Dashboard /></AppShell>
}
