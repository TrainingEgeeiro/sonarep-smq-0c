import Link from "next/link"
import { listProcesses } from "./actions"
import { ProcessRegistry } from "./process-registry"

export const dynamic = "force-dynamic"

export default async function ProcessesPage() {
  const result = await listProcesses()
  return <main className="min-h-screen bg-[#f4f7fa] px-5 py-8 text-slate-950 dark:bg-[#071b2d] dark:text-slate-50 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-3 border-b border-slate-200 pb-7 dark:border-slate-700 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/" className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">EGEEIROLYS SMQ-360</Link><p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#078f91] dark:text-[#49d5ce]">Référentiel qualité</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Référentiel des processus</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Une source de vérité persistante pour les processus qualité, leurs responsables déclaratifs et leur statut.</p></div><span className="w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">Développement · origine non vérifiée</span></header><ProcessRegistry initial={result} /></div></main>
}
