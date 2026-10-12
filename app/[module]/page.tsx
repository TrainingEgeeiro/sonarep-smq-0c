import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react"
import { modules } from "@/lib/navigation"

export function generateStaticParams() {
  return modules.filter((module) => module.href !== "/").map((module) => ({ module: module.href.slice(1) }))
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params
  const definition = modules.find((item) => item.href === `/${slug}`)
  if (!definition) notFound()

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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#078f91] dark:text-[#49d5ce]">SMQ-360 · module métier</p>
          <div className="mt-4 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{definition.label}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{definition.description}</p>
            </div>
            <LockKeyhole className="hidden size-8 text-slate-400 sm:block" aria-hidden="true" />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Link href={`/${slug}?detail=overview`} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#13b8b2] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2] dark:border-slate-700 dark:bg-[#0d2b44]">
              <p className="text-sm font-semibold">Page active</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">La navigation vers ce domaine fonctionne. Ouvrir la fiche détaillée du périmètre métier.</p>
            </Link>
<Link href={`/${slug}?detail=scope`} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#13b8b2] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2] dark:border-slate-700 dark:bg-[#0d2b44]">
              <p className="text-sm font-semibold">Périmètre</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Aucune donnée fictive n&apos;est présentée comme un résultat réel sur cette page.</p>
            </Link>
            <Link href="/" className="group rounded-xl border border-[#13b8b2]/40 bg-[#13b8b2]/5 p-6 transition hover:border-[#13b8b2] hover:bg-[#13b8b2]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2]">
              <p className="flex items-center justify-between text-sm font-semibold text-[#078f91]">Explorer un autre domaine <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Revenir au cockpit pour ouvrir un autre module.</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
