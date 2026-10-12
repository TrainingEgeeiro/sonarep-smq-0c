import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { AppShell } from '@/components/app-shell'
import { auth } from '@/lib/auth'
import { DataView, DocumentControlView } from '@/components/qms-views'
import { pageContent } from '@/lib/demo-data'

export function generateStaticParams() { return Object.keys(pageContent).map((slug) => ({ slug: slug.split('/') })) }

export default async function BusinessPage({ params }: { params: Promise<{ slug: string[] }> }) { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) redirect('/sign-in'); const { slug } = await params; const key = slug.join('/'); if (!pageContent[key]) notFound(); return <AppShell>{key === 'documents' ? <DocumentControlView /> : <DataView slug={key} />}</AppShell> }
