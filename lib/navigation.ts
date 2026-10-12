import type { LucideIcon } from "lucide-react"
import { Activity, AlertTriangle, BarChart3, BookOpenCheck, ClipboardCheck, FileCheck2, FileText, Gauge, ListChecks, Network, Settings2, ShieldCheck, Target, Users, Workflow } from "lucide-react"

export type ModuleDefinition = { label: string; description: string; href: string; icon: LucideIcon; tone: string }

export const modules: ModuleDefinition[] = [
  { label: "Vue d'ensemble", description: "Pilotage qualité et points d'attention", href: "/", icon: Gauge, tone: "text-cyan-600 bg-cyan-500/10" },
  { label: "Conformité", description: "Vue structurée du niveau de conformité", href: "/compliance", icon: ShieldCheck, tone: "text-emerald-600 bg-emerald-500/10" },
  { label: "Référentiel des exigences", description: "Exigences applicables et couverture", href: "/quality-requirements", icon: BookOpenCheck, tone: "text-blue-600 bg-blue-500/10" },
  { label: "Cartographie des processus", description: "Processus, interactions et pilotes", href: "/processes", icon: Network, tone: "text-indigo-600 bg-indigo-500/10" },
  { label: "Documents contrôlés", description: "Maîtrise du cycle documentaire", href: "/documents", icon: FileText, tone: "text-sky-600 bg-sky-500/10" },
  { label: "Preuves et enregistrements", description: "Éléments de preuve qualité", href: "/evidence", icon: ListChecks, tone: "text-teal-600 bg-teal-500/10" },
  { label: "Risques et opportunités", description: "Analyse et plans de maîtrise", href: "/risks", icon: AlertTriangle, tone: "text-amber-600 bg-amber-500/10" },
  { label: "Audits", description: "Programmes, constats et suivi", href: "/audits", icon: FileCheck2, tone: "text-violet-600 bg-violet-500/10" },
  { label: "Non-conformités", description: "Écarts, causes et actions correctives", href: "/nonconformities", icon: Target, tone: "text-rose-600 bg-rose-500/10" },
  { label: "Actions correctives", description: "Plans d'actions et efficacité", href: "/corrective-actions", icon: ClipboardCheck, tone: "text-orange-600 bg-orange-500/10" },
  { label: "Indicateurs de performance", description: "Mesure et pilotage des résultats", href: "/indicators", icon: BarChart3, tone: "text-fuchsia-600 bg-fuchsia-500/10" },
  { label: "Revues de direction", description: "Préparation et décisions de revue", href: "/management-review", icon: Activity, tone: "text-purple-600 bg-purple-500/10" },
  { label: "Compétences et sensibilisations", description: "Matrice et suivi des compétences", href: "/competencies", icon: Users, tone: "text-lime-600 bg-lime-500/10" },
  { label: "Évaluation des fournisseurs", description: "Qualification et surveillance", href: "/suppliers", icon: Workflow, tone: "text-slate-600 bg-slate-500/10" },
  { label: "Journal de traçabilité", description: "Événements et historique applicatif", href: "/activity-log", icon: Activity, tone: "text-cyan-600 bg-cyan-500/10" },
  { label: "Paramètres fonctionnels", description: "Référentiels et préférences", href: "/settings", icon: Settings2, tone: "text-slate-600 bg-slate-500/10" },
]

export function getModule(pathname: string) { return modules.find((module) => module.href === pathname) ?? modules[0] }

export function isActiveModule(pathname: string, href: string) { return href === "/" ? pathname === "/" : pathname.startsWith(href) }

export const navigationGroups = [
  { label: "Pilotage", items: modules.slice(0, 1) },
  { label: "Système qualité", items: modules.slice(1, 7) },
  { label: "Amélioration", items: modules.slice(7, 12) },
  { label: "Organisation", items: modules.slice(12) },
]

export const dashboardCards = [
  { label: "Conformité", value: "Donnée non configurée", detail: "Connectez le référentiel pour calculer cet indicateur", icon: ShieldCheck, tone: "text-emerald-600 bg-emerald-500/10" },
  { label: "Documents à réviser", value: "Donnée non configurée", detail: "Aucune source persistée disponible", icon: FileText, tone: "text-sky-600 bg-sky-500/10" },
  { label: "Actions ouvertes", value: "Donnée non configurée", detail: "Le suivi sera activé avec le module métier", icon: ClipboardCheck, tone: "text-amber-600 bg-amber-500/10" },
  { label: "Audits programmés", value: "Donnée non configurée", detail: "Aucun programme connecté", icon: FileCheck2, tone: "text-violet-600 bg-violet-500/10" },
]

export const moduleContents: Record<string, { eyebrow: string; title: string; description: string; next: string }> = Object.fromEntries(modules.slice(1).map((module) => [module.href, { eyebrow: "Egeeirolys SMQ-360", title: module.label, description: module.description, next: "Ce domaine est cadré dans l'architecture fonctionnelle. Les données persistées et les actions métier seront activées dans un incrément dédié.", }]))

export const modulePathnames = modules.map((module) => module.href)

export const iconLegend = "Les couleurs des icônes identifient le domaine métier et ne constituent pas un état de validation."

export const systemNotice = "Espace sans authentification : accès direct pour le cadrage applicatif. Ne pas exposer publiquement sans protection adaptée."

export const routeLabels = Object.fromEntries(modules.map((module) => [module.href, module.label]))

export const routeFamilies = ["Conformité", "Documents", "Risques", "Audits", "Amélioration", "Organisation"]

export const shellName = "EGEEIROLYS SMQ-360"

export const shellDescription = "Système de management de la qualité"

export const noDataLabel = "Données métier non configurées"

export const moduleCount = modules.length

export const dashboardHref = "/"

export const settingsHref = "/settings"

export const currentDateLabel = "12 octobre 2026"

export const statusLabel = "Socle applicatif"

export const roadmapLabel = "Incrément 01A"

export const securityLabel = "Accès sans identité fiable"

export const brandShortName = "EGEEIROLYS"

export const brandProductName = "SMQ-360"

export const emptyStateTitle = "Espace métier prêt à structurer"

export const emptyStateDescription = "Aucune donnée réelle n'est encore disponible pour ce module."

export const footerLabel = "Les actions métier ne sont pas encore connectées à une persistance."

export const searchPlaceholder = "Rechercher un module"

export const mobileMenuLabel = "Ouvrir la navigation"

export const breadcrumbRoot = "Accueil"

export const dashboardDescription = "Un point d'entrée orienté qualité pour consulter les domaines du système de management sans présenter de données fictives comme des résultats réels."

export const dashboardAttention = "Les indicateurs apparaîtront après activation des sources de données persistées."

export const dashboardSections = ["Synthèse de conformité", "Documents à réviser", "Actions correctives ouvertes", "Échéances", "Audits programmés", "Points d'attention", "Activité récente"]

export const legalBoundary = "Absence d'authentification et d'identité fiable documentée dans le référentiel de sécurité."

export const routeCount = modules.length

export const appTitle = "Egeeirolys SMQ-360"

export const appDescription = "Pilotage du système de management de la qualité"

export const productDisclaimer = "Les données sont indisponibles tant qu'aucune source métier persistée n'est configurée."

export const navAriaLabel = "Navigation principale"

export const mainContentLabel = "Contenu principal"

export const applicationStatus = "Fondations applicatives"

export const pendingWork = "Prochaine étape : Incrément 01B"

export const notImplementedLabel = "Non activé"

export const moduleIconAlt = "Icône du module"

export const sidebarFooter = "Accès direct de cadrage"

export const routeDescription = "Navigation vers un espace métier structuré"

export const stablePath = "/"

export const allModuleHrefs = modules.map(({ href }) => href)

export const brandText = `${brandShortName} ${brandProductName}`

export const dataState = "non-configurée"

export const shellVersion = "01A"

export const promptReference = "Prompt 00 + Incrément 01A"

export const noAuthMessage = "Aucune session utilisateur n'est requise sur ce socle."

export const noPersistenceMessage = "Aucune écriture de données métier n'est déclenchée sur ces pages."
