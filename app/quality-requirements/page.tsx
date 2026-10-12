import { listRequirements, getComplianceIndicators } from "./actions"
import { RequirementRegistry } from "./requirement-registry"

export const dynamic = "force-dynamic"

export default async function QualityRequirementsPage() {
  const [initial, indicators] = await Promise.all([listRequirements(), getComplianceIndicators()])
  return (
    <main className="min-h-screen bg-[#f4f7fa] px-5 py-8 text-slate-950 dark:bg-[#071b2d] dark:text-slate-50 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-200 pb-7 dark:border-slate-700">
          <a href="/" className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">EGEEIROLYS SMQ-360</a>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#078f91] dark:text-[#49d5ce]">Référentiel qualité</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Référentiel des exigences</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Exigences, évaluations et rattachements processus, calculés uniquement depuis la persistance configurée.</p>
        </header>
        <RequirementRegistry initial={initial} indicators={indicators} />
      </div>
    </main>
  )
}
