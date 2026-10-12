import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ClipboardList, FileSearch, LockKeyhole, Plus, Search, ShieldAlert, Users } from "lucide-react"
import { moduleContents, modules } from "@/lib/navigation"

const moduleViews: Record<string, { section: string; sectionDescription: string; emptyTitle: string; emptyDescription: string; columns: string[]; icon: typeof ClipboardList }> = {
  compliance: { section: "Évaluations de conformité", sectionDescription: "Suivez les exigences applicables et les écarts à traiter.", emptyTitle: "Aucune évaluation enregistrée", emptyDescription: "Commencez par sélectionner un référentiel et un périmètre d'évaluation.", columns: ["Exigence", "Périmètre", "Statut", "Dernière revue"], icon: ShieldAlert },
  "quality-requirements": { section: "Registre des exigences", sectionDescription: "Références normatives et exigences applicables au système qualité.", emptyTitle: "Le registre est prêt à être renseigné", emptyDescription: "Ajoutez une exigence, précisez sa source et décidez de son applicabilité.", columns: ["Référence", "Source", "Applicabilité", "Responsable"], icon: FileSearch },
  processes: { section: "Registre des processus", sectionDescription: "Pilotes, interactions et indicateurs de la cartographie qualité.", emptyTitle: "Aucun processus enregistré", emptyDescription: "Créez le premier processus et décrivez ses entrées, sorties et responsabilités.", columns: ["Processus", "Pilote", "Type", "Revue"], icon: ClipboardList },
  documents: { section: "Cycle de vie documentaire", sectionDescription: "Versions, approbations et documents actuellement en vigueur.", emptyTitle: "Aucun document dans cette vue", emptyDescription: "Créez un document pour démarrer son circuit de rédaction et d'approbation.", columns: ["Document", "Version", "Propriétaire", "État"], icon: FileSearch },
  risks: { section: "Registre des risques", sectionDescription: "Cotation, mesures de maîtrise et risque résiduel.", emptyTitle: "Le registre des risques est vide", emptyDescription: "Identifiez un risque, cotez-le puis définissez son plan de traitement.", columns: ["Risque", "Processus", "Criticité", "Traitement"], icon: ShieldAlert },
  audits: { section: "Programme et constats d'audit", sectionDescription: "Audits planifiés, constats et suivi des actions issues des audits.", emptyTitle: "Aucun audit dans le programme", emptyDescription: "Planifiez un audit en définissant son périmètre, ses critères et son équipe.", columns: ["Audit", "Périmètre", "Date", "État"], icon: ClipboardList },
  nonconformities: { section: "Registre des non-conformités", sectionDescription: "Écarts détectés, analyse des causes et actions de correction.", emptyTitle: "Aucune non-conformité enregistrée", emptyDescription: "Déclarez un écart pour lancer son analyse et son traitement.", columns: ["Référence", "Origine", "Gravité", "Échéance"], icon: ShieldAlert },
  "corrective-actions": { section: "Portefeuille d'actions", sectionDescription: "Actions correctives, responsables, échéances et revues d'efficacité.", emptyTitle: "Aucune action dans le portefeuille", emptyDescription: "Créez une action à partir d'un écart, d'un audit ou d'une revue de direction.", columns: ["Action", "Origine", "Responsable", "Échéance"], icon: ClipboardList },
  indicators: { section: "Tableau de pilotage", sectionDescription: "Mesures, objectifs et tendances des indicateurs qualité.", emptyTitle: "Aucune mesure disponible", emptyDescription: "Définissez un indicateur et sa source avant de saisir la première période.", columns: ["Indicateur", "Objectif", "Valeur", "Période"], icon: ClipboardList },
  evidence: { section: "Registre des preuves", sectionDescription: "Éléments de preuve rattachés aux exigences et aux processus.", emptyTitle: "Aucune preuve déposée", emptyDescription: "Déposez une preuve et rattachez-la à l'exigence ou au processus concerné.", columns: ["Preuve", "Type", "Rattachement", "Validité"], icon: FileSearch },
  settings: { section: "Référentiels administrés", sectionDescription: "Paramètres, sites, organisations et valeurs de référence du SMQ.", emptyTitle: "Aucun référentiel à afficher", emptyDescription: "Configurez le périmètre organisationnel avant d'activer les modules métier.", columns: ["Référentiel", "Périmètre", "Dernière mise à jour", "État"], icon: Users },
}

export function generateStaticParams() {
  return modules.filter((module) => module.href !== "/").map((module) => ({ module: module.href.slice(1) }))
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params
  const definition = modules.find((item) => item.href === `/${slug}`)
  if (!definition) notFound()
  const content = moduleContents[`/${slug}`]
  const view = moduleViews[slug]
  if (!content || !view) notFound()
  const ViewIcon = view.icon

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
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0d2b44]"><div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"><div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#13b8b2]/10 text-[#078f91]"><ViewIcon className="size-5" aria-hidden="true" /></div><div><h2 className="text-lg font-semibold">{view.section}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{view.sectionDescription}</p></div></div><Link href={`/${slug}?action=${encodeURIComponent(content.primaryAction)}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#078f91] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#057477] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2]"><Plus className="size-4" aria-hidden="true" />{content.primaryAction}</Link></div><div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row dark:border-slate-700"><div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400 dark:border-slate-600"><Search className="size-4" aria-hidden="true" /><span>Rechercher dans {view.section.toLowerCase()}</span></div><Link href={`/${slug}?view=filters`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#13b8b2] dark:border-slate-600 dark:text-slate-200">Filtres</Link></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-white/5 dark:text-slate-400"><tr>{view.columns.map((column) => <th className="px-5 py-3 font-semibold" key={column}>{column}</th>)}</tr></thead><tbody><tr><td colSpan={view.columns.length} className="px-5 py-12 text-center"><p className="font-semibold">{view.emptyTitle}</p><p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">{view.emptyDescription}</p><Link href={`/${slug}?action=${encodeURIComponent(content.primaryAction)}`} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#078f91] px-4 py-2 text-sm font-semibold text-white hover:bg-[#057477]"><Plus className="size-4" aria-hidden="true" />{content.primaryAction}</Link></td></tr></tbody></table></div></section>
          <section className="mt-5 grid gap-3 md:grid-cols-3">{content.workflows.map(([label, description, detail]) => <Link href={`/${slug}?workflow=${encodeURIComponent(detail)}`} key={label} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#13b8b2] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2] dark:border-slate-700 dark:bg-[#0d2b44]"><p className="text-sm font-semibold">{label}</p><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p><span className="mt-3 block text-xs font-semibold text-[#078f91]">Accéder au parcours</span></Link>)}</section>
          <div className="mt-5 rounded-xl border border-amber-300/40 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">Espace de développement : les indicateurs affichent « — » tant qu&apos;aucune source métier persistée n&apos;est connectée.</div>
        </section>
      </div>
    </main>
  )
}
