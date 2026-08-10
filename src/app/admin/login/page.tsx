'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconShield, IconLoader2, IconLock, IconMail } from '@tabler/icons-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Erreur de connexion')
      return
    }

    router.replace('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B2E] via-[#1E1560] to-[#0F0B2E] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B6DFF 100%)', boxShadow: '0 8px 24px rgba(108,71,255,0.4)' }}>
            <IconShield size={24} className="text-white" />
          </div>
          <h1 className="text-white font-black text-xl tracking-tight">bcarte admin</h1>
          <p className="text-white/40 text-xs mt-1">Accès réservé aux administrateurs</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit}
          className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-6 space-y-4">

          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <IconMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@exemple.com"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">Mot de passe</label>
            <div className="relative">
              <IconLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B6DFF 100%)', boxShadow: '0 4px 16px rgba(108,71,255,0.35)' }}>
            {loading ? <IconLoader2 size={16} className="animate-spin" /> : <IconShield size={16} />}
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-white/20 text-[11px] mt-6">
          bcarte · Panneau d&apos;administration
        </p>
      </div>
    </div>
  )
}
