import { notFound } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { DataView } from '@/components/qms-views'
import { pageContent } from '@/lib/demo-data'

export function generateStaticParams() { return Object.keys(pageContent).map((slug) => ({ slug: slug.split('/') })) }

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const key = slug.join('/')
  if (!pageContent[key]) notFound()
  return <AppShell><DataView slug={key} /></AppShell>
}
