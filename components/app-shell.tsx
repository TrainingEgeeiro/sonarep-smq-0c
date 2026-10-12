'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, BarChart3, Bell, BookOpen, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck, Clock3, FileCheck2, FileClock, FileText, Factory, FolderCheck, GraduationCap, LayoutDashboard, ListChecks, Menu, Search, Settings2, ShieldAlert, TriangleAlert, X } from 'lucide-react'
import { navGroups, statusTone } from '@/lib/demo-data'

const icons = { Activity, AlertTriangle, BarChart3, Bell, BookOpen, CheckCircle2, ClipboardCheck, Clock3, FileCheck2, FileClock, FileText, Factory, FolderCheck, GraduationCap, LayoutDashboard, ListChecks, Search, Settings2, ShieldAlert, TriangleAlert }

function Icon({ name, className }: { name: string; className?: string }) { const Component = icons[name as keyof typeof icons] || Activity; return <Component className={className} aria-hidden="true" /> }

export function StatusBadge({ value }: { value: string }) { const tone = statusTone(value); return <span className={`status-badge status-${tone}`}>{value}</span> }

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pageLabel = pathname === '/' ? 'Tableau de bord' : navGroups.flatMap((group) => group.items).find((item) => item.href === pathname)?.label || 'Vue métier'
  const currentGroup = navGroups.find((group) => group.items.some((item) => item.href === pathname))?.label || 'Pilotage'
  const searchHint = useMemo(() => pathname === '/' ? 'Rechercher dans le tableau de bord' : `Rechercher dans ${pageLabel.toLowerCase()}`, [pageLabel, pathname])

  return <div className="min-h-screen bg-[#f5f7fb] text-[#142238]">
    <aside className={`app-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark">Q</div>
        {!collapsed && <div><div className="brand-name">SONAREP</div><div className="brand-subtitle">QMS 360</div></div>}
        <button className="sidebar-close md:hidden" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu"><X /></button>
      </div>
      <div className="sidebar-prototype"><span className="prototype-dot" />{!collapsed && <span>Prototype de démonstration</span>}</div>
      <nav className="sidebar-nav" aria-label="Navigation principale">
        {navGroups.map((group) => <div className="nav-group" key={group.label}><div className="nav-group-label">{!collapsed && group.label}</div>{group.items.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-item ${pathname === item.href ? 'is-active' : ''}`} title={collapsed ? item.label : undefined}><Icon name={item.icon} /><span>{!collapsed && item.label}</span>{!collapsed && item.href === '/notifications' && <span className="nav-count">4</span>}</Link>)}</div>)}
      </nav>
      <div className="sidebar-footer">{!collapsed && <div className="sidebar-footer-card"><div className="flex items-center gap-2"><span className="status-dot" /> Environnement démo</div><span>Données fictives uniquement</span></div>}<button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}>{collapsed ? <ChevronRight /> : <><ChevronLeft /><span>Réduire le menu</span></>}</button></div>
    </aside>
    {mobileOpen && <button className="mobile-scrim md:hidden" onClick={() => setMobileOpen(false)} aria-label="Fermer la navigation" />}
    <div className={`app-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="app-header">
        <div className="flex min-w-0 items-center gap-3"><button className="mobile-menu md:hidden" onClick={() => setMobileOpen(true)} aria-label="Ouvrir la navigation"><Menu /></button><div className="breadcrumbs"><span>{currentGroup}</span><span className="breadcrumb-separator">/</span><strong>{pageLabel}</strong></div></div>
        <div className="header-actions"><label className="search-box"><Search /><span className="sr-only">{searchHint}</span><input aria-label={searchHint} placeholder={searchHint} /></label><div className="relative"><button className="header-icon-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Ouvrir les notifications"><Bell /><span className="notification-dot">4</span></button>{notificationsOpen && <div className="notification-popover"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><strong>Notifications</strong><span className="text-xs text-slate-400">4 non lues</span></div><div className="flex flex-col gap-3 p-4 text-xs"><div><StatusBadge value="Critique" /><p className="mt-1 font-medium">Action corrective échue</p></div><div><StatusBadge value="Attention" /><p className="mt-1 font-medium">Révision documentaire proche</p></div></div><Link href="/notifications" className="block border-t border-slate-100 px-4 py-3 text-center text-xs font-semibold text-blue-700">Voir toutes les notifications</Link></div>}</div><div className="profile-chip" aria-label="Utilisateur de démonstration"><div className="profile-avatar">DM</div><div className="hidden lg:block text-left"><div className="profile-name">Démonstration</div><div className="profile-role">Accès sans authentification</div></div><ChevronDown className="hidden size-4 text-slate-400 lg:block" /></div></div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  </div>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) { return <div className="page-header"><div><div className="eyebrow">{eyebrow || 'SONAREP QMS 360'}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="page-header-action">{action}</div>}</div> }
export function DemoBanner() { return <div className="demo-banner"><div className="demo-banner-icon"><Activity /></div><div><strong>Environnement de démonstration</strong><span>Indicateurs fictifs, non représentatifs de la performance réelle de SONAREP.</span></div><span className="demo-label">DONNÉES FICTIVES</span></div> }
export { Icon }
