import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Gauge,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  Target,
} from "lucide-react";

const modules = [
  { label: "Conformité", value: "92%", detail: "18 exigences suivies", href: "/compliance", icon: ShieldCheck, tone: "text-emerald-600 bg-emerald-500/10" },
  { label: "Documents contrôlés", value: "24", detail: "3 révisions à valider", href: "/documents", icon: FileText, tone: "text-sky-600 bg-sky-500/10" },
  { label: "Actions ouvertes", value: "07", detail: "2 échéances cette semaine", href: "/corrective-actions", icon: ClipboardCheck, tone: "text-amber-600 bg-amber-500/10" },
  { label: "Audits planifiés", value: "03", detail: "Prochain audit · 18 oct.", href: "/audits", icon: FileCheck2, tone: "text-violet-600 bg-violet-500/10" },
];

const navigation = [
  ["Vue d'ensemble", Gauge, "/", "text-cyan-300"], ["Conformité", ShieldCheck, "/compliance", "text-emerald-300"], ["Référentiel qualité", BookOpenCheck, "/quality-requirements", "text-blue-300"], ["Documents contrôlés", FileText, "/documents", "text-sky-300"], ["Risques", AlertTriangle, "/risks", "text-amber-300"], ["Audits", FileCheck2, "/audits", "text-violet-300"], ["Non-conformités", Target, "/nonconformities", "text-rose-300"], ["Actions correctives", ClipboardCheck, "/corrective-actions", "text-orange-300"], ["Indicateurs et pilotage", BarChart3, "/indicators", "text-indigo-300"], ["Administration", Settings2, "/settings", "text-slate-200"],
] as const;

const activities = [
  ["Revue documentaire ISO 9001", "Responsable qualité", "Aujourd'hui, 09:42", "En cours", "bg-sky-500/10 text-sky-700"],
  ["Écart NC-2026-014 enregistré", "Atelier production", "Hier, 16:18", "À traiter", "bg-amber-500/10 text-amber-700"],
  ["Plan d'action PA-026 clôturé", "Équipe qualité", "Hier, 11:05", "Clôturé", "bg-emerald-500/10 text-emerald-700"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f7fa] text-slate-950 dark:bg-[#071b2d] dark:text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12" id="dashboard">
          <header className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-start sm:justify-between dark:border-slate-700"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#078f91] dark:text-[#49d5ce]">Système de management de la qualité</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Vue d&apos;ensemble</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Pilotez la conformité, les documents et les plans d&apos;action d&apos;Egeeirolys depuis un espace unifié.</p></div><div className="flex items-center gap-3"><span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">Données de développement</span><span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">12 octobre 2026</span></div></header>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{modules.map(({ label, value, detail, icon: Icon, tone, href }) => <Link className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#13b8b2] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#13b8b2] dark:border-slate-700 dark:bg-[#0d2b44]" href={href} key={label}><div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p><div className={`flex size-9 items-center justify-center rounded-lg ${tone}`}><Icon className="size-4" aria-hidden="true" /></div></div><p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p><span className="mt-4 block text-xs font-semibold text-[#078f91] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">Ouvrir le module</span></Link>)}</div>
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_1fr]"><section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0d2b44]" id="conformite"><div className="flex items-start justify-between border-b border-slate-200 p-6 dark:border-slate-700"><div><h2 className="font-semibold">État de la conformité</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lecture indicative du périmètre de développement</p></div><Activity className="size-5 text-[#078f91]" aria-hidden="true" /></div><div className="grid gap-6 p-6 sm:grid-cols-2"><div><p className="text-5xl font-semibold tracking-tight">92<span className="text-2xl text-slate-500">%</span></p><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">niveau de couverture documentaire</p><div className="mt-6 h-2 rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-2 w-[92%] rounded-full bg-[#13b8b2]" /></div></div><div className="flex flex-col gap-4 text-sm"><div className="flex items-center justify-between"><span className="text-slate-500">Conforme</span><span className="font-semibold text-emerald-600">18</span></div><div className="flex items-center justify-between"><span className="text-slate-500">En revue</span><span className="font-semibold text-violet-600">03</span></div><div className="flex items-center justify-between"><span className="text-slate-500">À compléter</span><span className="font-semibold text-amber-600">01</span></div></div></div></section><section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0d2b44]" id="risques"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10"><AlertTriangle className="size-4 text-amber-600" aria-hidden="true" /></div><div><h2 className="font-semibold">Points d&apos;attention</h2><p className="text-sm text-slate-500 dark:text-slate-400">Éléments à examiner</p></div></div><div className="mt-6 flex flex-col gap-4"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-4 text-emerald-500" /><p className="text-sm text-slate-600 dark:text-slate-300">Revue de la procédure de gestion documentaire</p></div><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-4 text-amber-500" /><p className="text-sm text-slate-600 dark:text-slate-300">Deux actions arrivent à échéance cette semaine</p></div></div></section></div>
          <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0d2b44]" id="documents"><div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700"><div><h2 className="font-semibold">Activité récente</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Journal indicatif non persistant · développement</p></div><button className="flex items-center gap-1 text-sm font-semibold text-[#078f91] hover:underline" type="button">Voir tout <ArrowUpRight className="size-4" aria-hidden="true" /></button></div><div className="divide-y divide-slate-200 dark:divide-slate-700">{activities.map(([title, owner, date, status, tone]) => <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between" key={title}><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{owner} · {date}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{status}</span></div>)}</div></section>
          <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">Prompt 00 · Socle de cadrage uniquement · Authentification et données métier hors périmètre</p>
        </section>
      </div>
    </main>
  );
}
