import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { AuthForm } from '@/components/auth-form'
import { isUnauthenticatedDemoMode } from '@/lib/demo-mode'

export default async function SignInPage() {
  if (isUnauthenticatedDemoMode()) redirect('/')
  const { auth } = await import('@/lib/auth')
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return <AuthForm />
}
