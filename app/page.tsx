import {
  ArrowUpRight,
  ClipboardCheck,
  FileCheck2,
  FileText,
  LockKeyhole,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

const modules = [
  { label: "Conformité", value: "92%", detail: "18 exigences suivies", icon: ShieldCheck },
  { label: "Documents contrôlés", value: "24", detail: "3 révisions à valider", icon: FileText },
  { label: "Actions ouvertes", value: "07", detail: "2 échéances cette semaine", icon: ClipboardCheck },
  { label: "Audits planifiés", value: "03", detail: "Prochain audit · 18 oct.", icon: FileCheck2 },
];

const activities = [
  ["Revue documentaire ISO 9001", "Responsable qualité", "Aujourd'hui, 09:42", "En cours"],
  ["Écart NC-2026-014 enregistré", "Atelier production", "Hier, 16:18", "À traiter"],
  ["Plan d'action PA-026 clôturé", "Démonstrateur", "Hier, 11:05", "Clôturé"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-card/30 px-5 py-6 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-border/70 pb-7">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">S</div>
            <div>
              <p className="text-sm font-semibold tracking-wide">SONAREP</p>
              <p className="text-xs text-muted-foreground">SMQ 360</p>
            </div>
          </div>
          <nav aria-label="Navigation principale" className="mt-8 flex flex-col gap-2 text-sm">
            <a className="rounded-lg bg-primary/10 px-3 py-2.5 font-medium text-primary" href="#dashboard">Vue d&apos;ensemble</a>
            <a className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-muted" href="#conformite">Conformité</a>
            <a className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-muted" href="#documents">Documents contrôlés</a>
            <a className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-muted" href="#actions">Actions correctives</a>
            <a className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-muted" href="#audits">Audits</a>
            <a className="rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-muted" href="#pilotage">Pilotage</a>
          </nav>
          <div className="mt-auto rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-xs font-medium"><LockKeyhole className="size-3.5 text-muted-foreground" /> Socle non authentifié</div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Données fictives de démonstration. Aucun accès opérationnel.</p>
          </div>
        </aside>

        <section className="flex-1 px-5 py-6 sm:px-8 lg:px-12" id="dashboard">
          <header className="flex flex-col gap-5 border-b border-border/70 pb-7 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Espace qualité · Démonstrateur V1</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Vue d&apos;ensemble</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Une lecture synthétique de la maîtrise du système qualité de SONAREP.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300">Données fictives</span>
              <span className="hidden text-xs text-muted-foreground sm:inline">12 octobre 2026</span>
            </div>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {modules.map(({ label, value, detail, icon: Icon }) => (
              <article className="rounded-xl border border-border bg-card p-5" key={label}>
                <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p><Icon className="size-4 text-primary" /></div>
                <p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
            <section className="rounded-xl border border-border bg-card" id="conformite">
              <div className="flex items-start justify-between border-b border-border/70 p-6"><div><h2 className="font-semibold">État de la conformité</h2><p className="mt-1 text-sm text-muted-foreground">Lecture indicative du périmètre de démonstration</p></div><ArrowUpRight className="size-5 text-muted-foreground" /></div>
              <div className="grid gap-6 p-6 sm:grid-cols-2"><div><p className="text-5xl font-semibold tracking-tight">92<span className="text-2xl text-muted-foreground">%</span></p><p className="mt-2 text-sm text-muted-foreground">niveau de couverture documentaire</p><div className="mt-6 h-2 rounded-full bg-muted"><div className="h-2 w-[92%] rounded-full bg-primary" /></div></div><div className="flex flex-col gap-4 text-sm"><div className="flex items-center justify-between"><span className="text-muted-foreground">Conforme</span><span className="font-medium">18</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">En revue</span><span className="font-medium">03</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">À compléter</span><span className="font-medium">01</span></div></div></div>
            </section>
            <section className="rounded-xl border border-border bg-card p-6" id="actions"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10"><TriangleAlert className="size-4 text-destructive" /></div><div><h2 className="font-semibold">Points d&apos;attention</h2><p className="text-sm text-muted-foreground">Éléments à examiner</p></div></div><div className="mt-6 flex flex-col gap-4"><div className="border-l-2 border-amber-400 pl-4"><p className="text-sm font-medium">3 documents arrivent à échéance</p><p className="mt-1 text-xs text-muted-foreground">Révision requise avant le 20 octobre</p></div><div className="border-l-2 border-primary pl-4"><p className="text-sm font-medium">2 actions sans responsable</p><p className="mt-1 text-xs text-muted-foreground">Affectation à définir en revue qualité</p></div></div></section>
          </div>

          <section className="mt-6 rounded-xl border border-border bg-card" id="documents"><div className="flex items-center justify-between border-b border-border/70 p-6"><div><h2 className="font-semibold">Activité récente</h2><p className="mt-1 text-sm text-muted-foreground">Journal de démonstration non persistant</p></div><button className="text-sm font-medium text-primary hover:underline" type="button">Voir tout</button></div><div className="divide-y divide-border/70">{activities.map(([title, owner, date, status]) => <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between" key={title}><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">{owner} · {date}</p></div><span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{status}</span></div>)}</div></section>
          <p className="mt-8 text-center text-xs text-muted-foreground">Prompt 00 · Socle de cadrage uniquement · Authentification et données métier hors périmètre</p>
        </section>
      </div>
    </main>
  );
}
