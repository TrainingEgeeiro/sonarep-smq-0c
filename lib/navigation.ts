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

export type ModuleBlueprint = { eyebrow: string; title: string; description: string; primaryAction: string; workflows: [string, string, string][]; metrics: [string, string, string][] }

export const moduleContents: Record<string, ModuleBlueprint> = {
  "/compliance": { eyebrow: "Gouvernance de conformité", title: "Conformité", description: "Piloter la couverture des exigences, les écarts de conformité et les plans de mise en conformité.", primaryAction: "Évaluer la conformité", workflows: [["Périmètre", "Définir les sites, processus et référentiels applicables", "périmètre"], ["Évaluation", "Qualifier le niveau de conformité exigence par exigence", "évaluation"], ["Plans d'action", "Traiter les écarts avec responsables et échéances", "actions"]], metrics: [["Couverture", "—", "exigences évaluées"], ["Écarts ouverts", "—", "à traiter"], ["Échéances", "—", "cette période"]] },
  "/evidence": { eyebrow: "Preuves et enregistrements", title: "Preuves et enregistrements", description: "Centraliser les preuves, les enregistrements qualité et leur rattachement aux exigences et processus.", primaryAction: "Déposer une preuve", workflows: [["Collecte", "Déposer et classer une preuve contrôlée", "collecte"], ["Rattachement", "Relier la preuve à une exigence ou un processus", "rattachement"], ["Vérification", "Contrôler la validité, l'auteur et la période", "vérification"]], metrics: [["Preuves valides", "—", "enregistrements"], ["À vérifier", "—", "en attente"], ["Traçabilité", "—", "liens actifs"]] },
  "/corrective-actions": { eyebrow: "Amélioration continue", title: "Actions correctives", description: "Transformer les écarts en actions suivies, responsables, échéances et revues d'efficacité.", primaryAction: "Créer une action", workflows: [["Planification", "Définir la cause, l'action et le responsable", "planification"], ["Réalisation", "Suivre les jalons et les éléments de preuve", "réalisation"], ["Efficacité", "Revoir le résultat et clôturer avec justification", "efficacité"]], metrics: [["Actions ouvertes", "—", "à piloter"], ["En retard", "—", "échéances dépassées"], ["Efficacité", "—", "revues à planifier"]] },
  "/management-review": { eyebrow: "Pilotage stratégique", title: "Revues de direction", description: "Préparer les revues de direction, consolider les entrées qualité et journaliser les décisions.", primaryAction: "Préparer une revue", workflows: [["Préparation", "Consolider indicateurs, risques, audits et actions", "préparation"], ["Revue", "Tracer les décisions et arbitrages de direction", "revue"], ["Suivi", "Transformer les décisions en actions pilotées", "suivi"]], metrics: [["Revues planifiées", "—", "à préparer"], ["Décisions", "—", "à suivre"], ["Actions issues des revues", "—", "ouvertes"]] },
  "/competencies": { eyebrow: "Ressources et compétences", title: "Compétences et sensibilisations", description: "Maintenir la matrice des compétences, les habilitations et les besoins de sensibilisation.", primaryAction: "Évaluer une compétence", workflows: [["Matrice", "Définir les compétences requises par fonction", "matrice"], ["Évaluation", "Évaluer les personnes et identifier les écarts", "évaluation"], ["Développement", "Planifier formations et sensibilisations", "développement"]], metrics: [["Compétences maîtrisées", "—", "évaluations"], ["Habilitations", "—", "à renouveler"], ["Besoins", "—", "plans à créer"]] },
  "/suppliers": { eyebrow: "Achats et partenaires", title: "Évaluation des fournisseurs", description: "Qualifier les fournisseurs, suivre leur performance et maîtriser les risques liés aux achats.", primaryAction: "Qualifier un fournisseur", workflows: [["Qualification", "Évaluer les critères d'entrée et documents requis", "qualification"], ["Surveillance", "Suivre qualité, délais et incidents fournisseur", "surveillance"], ["Revue", "Renouveler ou suspendre la qualification", "revue"]], metrics: [["Fournisseurs actifs", "—", "qualifiés"], ["Évaluations dues", "—", "à réaliser"], ["Incidents", "—", "à analyser"]] },
  "/activity-log": { eyebrow: "Traçabilité et auditabilité", title: "Journal de traçabilité", description: "Consulter les événements applicatifs, les changements et les preuves de traçabilité du système qualité.", primaryAction: "Filtrer le journal", workflows: [["Recherche", "Filtrer par acteur, date, objet ou action", "recherche"], ["Analyse", "Examiner le détail d'un événement", "analyse"], ["Export", "Préparer un extrait pour audit ou revue", "export"]], metrics: [["Événements", "—", "journalisés"], ["Aujourd'hui", "—", "événements"], ["Objets suivis", "—", "types métier"]] },
  "/settings": { eyebrow: "Administration fonctionnelle", title: "Paramètres fonctionnels", description: "Administrer les référentiels, les paramètres de fonctionnement et les règles de configuration du SMQ.", primaryAction: "Gérer un référentiel", workflows: [["Référentiels", "Administrer statuts, catégories et valeurs métier", "référentiels"], ["Périmètre", "Configurer organisations, sites et processus", "périmètre"], ["Contrôles", "Vérifier les paramètres avant mise en service", "contrôles"]], metrics: [["Référentiels", "—", "configurés"], ["Sites", "—", "dans le périmètre"], ["Contrôles", "—", "à vérifier"]] },
  "/quality-requirements": { eyebrow: "Référentiel qualité", title: "Référentiel des exigences", description: "Identifier les exigences applicables, leur source, leur responsable et le niveau de maîtrise démontré par les preuves associées.", primaryAction: "Ajouter une exigence", workflows: [["Référencement", "Importer ou créer une exigence avec sa source normative", "référencement"], ["Applicabilité", "Décider si l'exigence s'applique au périmètre", "applicabilité"], ["Évaluation", "Qualifier la conformité et rattacher les preuves", "évaluation"]], metrics: [["Exigences", "—", "référencées"], ["Applicables", "—", "dans le périmètre"], ["Sans preuve", "—", "à documenter"]] },
  "/processes": { eyebrow: "Cartographie qualité", title: "Cartographie des processus", description: "Décrire les processus, leurs pilotes, leurs interactions, leurs risques et les indicateurs de performance associés.", primaryAction: "Créer un processus", workflows: [["Cartographie", "Définir finalité, entrées, sorties et interactions", "cartographie"], ["Pilotage", "Affecter un pilote et les responsabilités clés", "pilotage"], ["Surveillance", "Relier risques, objectifs et indicateurs", "surveillance"]], metrics: [["Processus", "—", "cartographiés"], ["Pilotes", "—", "responsabilités"], ["À revoir", "—", "revues dues"]] },
  "/documents": { eyebrow: "Maîtrise documentaire", title: "Documents contrôlés", description: "Gérer la création, la revue, l'approbation, la diffusion et l'archivage des documents du système qualité.", primaryAction: "Créer un document", workflows: [["Rédaction", "Créer une version et identifier le propriétaire", "rédaction"], ["Approbation", "Faire valider la version avant diffusion", "approbation"], ["Diffusion", "Maîtriser les copies en vigueur et l'archivage", "diffusion"]], metrics: [["Documents actifs", "—", "en vigueur"], ["À réviser", "—", "échéances proches"], ["En approbation", "—", "circuits ouverts"]] },
  "/risks": { eyebrow: "Gestion des risques", title: "Risques et opportunités", description: "Identifier, évaluer et traiter les risques qualité afin de protéger les processus et de saisir les opportunités d'amélioration.", primaryAction: "Enregistrer un risque", workflows: [["Identification", "Décrire la situation, la cause et les conséquences", "identification"], ["Évaluation", "Coter probabilité, impact et criticité", "évaluation"], ["Traitement", "Définir les mesures de maîtrise et le risque résiduel", "traitement"]], metrics: [["Risques actifs", "—", "dans le registre"], ["Critiques", "—", "à traiter"], ["Plans de maîtrise", "—", "en cours"]] },
  "/audits": { eyebrow: "Programme d'audit", title: "Audits et constats", description: "Planifier les audits, préparer les critères, recueillir les constats et suivre la clôture des actions issues de l'audit.", primaryAction: "Planifier un audit", workflows: [["Programme", "Définir le calendrier, le périmètre et l'équipe", "programme"], ["Réalisation", "Tracer les preuves, entretiens et constats", "réalisation"], ["Suivi", "Qualifier les écarts et vérifier leur clôture", "suivi"]], metrics: [["Audits planifiés", "—", "dans le programme"], ["Constats ouverts", "—", "à traiter"], ["Rapports", "—", "à approuver"]] },
  "/nonconformities": { eyebrow: "Écarts qualité", title: "Non-conformités", description: "Enregistrer les écarts, analyser leurs causes, définir les corrections et piloter les actions jusqu'à la vérification d'efficacité.", primaryAction: "Déclarer une non-conformité", workflows: [["Détection", "Décrire l'écart, son origine et son niveau de gravité", "détection"], ["Cause", "Rechercher la cause racine avec les parties prenantes", "cause"], ["Correction", "Suivre l'action et vérifier son efficacité", "correction"]], metrics: [["Écarts ouverts", "—", "à qualifier"], ["Critiques", "—", "priorité haute"], ["En retard", "—", "échéances dépassées"]] },
  "/indicators": { eyebrow: "Pilotage de la performance", title: "Indicateurs et pilotage", description: "Définir les indicateurs, collecter les mesures, analyser les tendances et déclencher les décisions de pilotage qualité.", primaryAction: "Définir un indicateur", workflows: [["Définition", "Fixer objectif, formule, source et fréquence", "définition"], ["Mesure", "Saisir ou intégrer les valeurs de la période", "mesure"], ["Analyse", "Commenter la tendance et décider des actions", "analyse"]], metrics: [["Indicateurs actifs", "—", "suivis"], ["Mesures dues", "—", "période courante"], ["Sous objectif", "—", "à analyser"]] },
}


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
