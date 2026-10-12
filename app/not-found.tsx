import Link from "next/link"
import { ArrowLeft, Compass, Home, SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-1px)] items-center justify-center px-5 py-16 sm:px-8">
      <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-[#0d2b44] sm:p-12">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#13b8b2]/10 text-[#078f91] dark:bg-[#13b8b2]/15 dark:text-[#49d5ce]">
            <SearchX className="size-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#078f91] dark:text-[#49d5ce]">SMQ-360 · Navigation</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Cette page n&apos;existe pas</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">La ressource demandée est introuvable ou a été déplacée. Utilisez un accès métier ci-dessous pour poursuivre votre parcours qualité.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link href="/" className="group rounded-xl border border-[#13b8b2]/30 bg-[#13b8b2]/5 p-4 transition hover:border-[#13b8b2] hover:bg-[#13b8b2]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2]"><Home className="size-5 text-[#078f91]" aria-hidden="true" /><span className="mt-3 block text-sm font-semibold">Vue d&apos;ensemble</span><span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Revenir au cockpit</span></Link>
          <Link href="/processes" className="rounded-xl border border-slate-200 p-4 transition hover:border-[#13b8b2] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2] dark:border-slate-700"><Compass className="size-5 text-cyan-600" aria-hidden="true" /><span className="mt-3 block text-sm font-semibold">Processus</span><span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Ouvrir la cartographie</span></Link>
          <Link href="/risks" className="rounded-xl border border-slate-200 p-4 transition hover:border-amber-500 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-slate-700"><ArrowLeft className="size-5 text-amber-600" aria-hidden="true" /><span className="mt-3 block text-sm font-semibold">Risques</span><span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">Accéder au registre</span></Link>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700"><Link href="/" className="text-sm font-semibold text-[#078f91] hover:underline">Retourner à la page d&apos;accueil</Link></div>
      </section>
    </main>
  )
}
