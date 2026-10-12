'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)
    const result = await authClient.signIn.email({ email, password })
    setPending(false)
    if (result.error) { setError('Connexion impossible. Vérifiez vos identifiants.'); return }
    router.push('/')
    router.refresh()
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-12"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><div className="mb-8 flex items-center gap-3"><div className="brand-mark">Q</div><div><div className="brand-name text-[#142238]">SONAREP</div><div className="brand-subtitle">QMS 360</div></div></div><div className="mb-6"><p className="eyebrow">Accès sécurisé</p><h1 className="mt-2 text-2xl font-semibold text-[#142238]">Connexion à l’espace qualité</h1><p className="mt-2 text-sm text-slate-500">Utilisez un compte de démonstration autorisé.</p></div><form onSubmit={handleSubmit} className="flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Adresse e-mail<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500" /></label><label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Mot de passe<input required type="password" minLength={8} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500" /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={pending} className="mt-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">{pending ? 'Connexion…' : 'Se connecter'}</button></form><p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">Les inscriptions publiques sont désactivées pour ce démonstrateur.</p></section></main>
}
