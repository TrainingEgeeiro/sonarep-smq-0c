"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LockKeyhole, Menu } from "lucide-react"
import { navigationGroups, isActiveModule } from "@/lib/navigation"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-950 dark:bg-[#071b2d] dark:text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-[#092b49] px-5 py-6 text-white lg:flex dark:border-slate-700">
          <Link href="/" className="border-b border-white/15 pb-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#49d5ce]"><p className="text-sm font-bold tracking-[0.12em]">EGEEIROLYS</p><p className="text-xs font-medium text-[#73e2dc]">SMQ-360</p></Link>
          <nav aria-label="Navigation principale" className="mt-6 flex flex-col gap-5 overflow-y-auto">
            {navigationGroups.map((group) => <div key={group.label}><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{group.label}</p><div className="flex flex-col gap-1">{group.items.map(({ label, href, icon: Icon, tone }) => <Link key={href} href={href} aria-current={isActiveModule(pathname, href) ? "page" : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActiveModule(pathname, href) ? "bg-[#13b8b2] text-white shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon className={`size-4 ${isActiveModule(pathname, href) ? "text-white" : tone.split(" ")[0]}`} aria-hidden="true" /><span>{label}</span></Link>)}</div></div>)}
          </nav>
          <div className="mt-auto rounded-xl border border-amber-300/20 bg-amber-400/10 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-amber-200"><LockKeyhole className="size-3.5" /> Environnement de développement</div><p className="mt-2 text-xs leading-relaxed text-slate-300">Données fictives clairement identifiées. Aucun accès opérationnel.</p></div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="border-b border-slate-200 bg-white/90 px-4 py-3 lg:hidden dark:border-slate-700 dark:bg-[#092b49]"><div className="flex items-center gap-2 text-sm font-semibold"><Menu className="size-4 text-[#13b8b2]" /> Modules SMQ-360</div><nav aria-label="Navigation mobile" className="mt-3 flex gap-2 overflow-x-auto pb-1">{navigationGroups.flatMap((group) => group.items).map(({ label, href }) => <Link key={href} href={href} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs ${isActiveModule(pathname, href) ? "border-[#13b8b2] bg-[#13b8b2] text-white" : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"}`}>{label}</Link>)}</nav></div>
          {children}
        </div>
      </div>
    </div>
  )
}
