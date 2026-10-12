import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, LockKeyhole } from "lucide-react"
import { moduleContents, modules } from "@/lib/navigation"

export function generateStaticParams() {
  return modules.filter((module) => module.href !== "/").map((module) => ({ module: module.href.slice(1) }))
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params
  const definition = modules.find((item) => item.href === `/${slug}`)
  if (!definition) notFound()
  const content = moduleContents[`/${slug}`]
  if (!content) notFound()

  return (
    <main className="min-h-screen bg-[#f4f7fa] text-slate-950 dark:bg-[#071b2d] dark:text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-slate-200 pb-6 dark:border-slate-700">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#078f91] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2]">
            <ArrowLeft className="size-4" aria-hidden="true" /> Retour à la vue d&apos;ensemble
          </Link>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">Espace de développement</span>
        </header>
        <section className="flex flex-1 flex-col justify-center py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#078f91] dark:text-[#49d5ce]">{content.eyebrow}</p>
          <div className="mt-4 flex items-start justify-between gap-6">
            <div><h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{content.title}</h1><p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{content.description}</p></div>
            <LockKeyhole className="hidden size-8 text-slate-400 sm:block" aria-hidden="true" />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">{content.metrics.map(([label, value, detail]) => <Link href={`/${slug}?detail=${encodeURIComponent(label)}`} key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#13b8b2] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2] dark:border-slate-700 dark:bg-[#0d2b44]"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p></Link>)}</div>
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0d2b44]"><div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"><div><h2 className="text-lg font-semibold">Parcours métier</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Les étapes opérationnelles du module {content.title.toLowerCase()}.</p></div><Link href={`/${slug}?action=${encodeURIComponent(content.primaryAction)}`} className="inline-flex items-center justify-center rounded-lg bg-[#078f91] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#057477] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2]">{content.primaryAction}</Link></div><div className="grid gap-3 p-4 md:grid-cols-3">{content.workflows.map(([label, description, detail]) => <Link href={`/${slug}?workflow=${encodeURIComponent(detail)}`} key={label} className="rounded-xl border border-slate-200 p-4 transition hover:border-[#13b8b2] hover:bg-[#13b8b2]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2] dark:border-slate-700"><p className="text-sm font-semibold">{label}</p><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p><span className="mt-3 block text-xs font-semibold text-[#078f91]">Ouvrir l&apos;espace</span></Link>)}</div></section>
          <div className="mt-5 rounded-xl border border-amber-300/40 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">Espace de développement : les indicateurs affichent « — » tant qu&apos;aucune source métier persistée n&apos;est connectée.</div>
        </section>
      </div>
    </main>
  )
}
