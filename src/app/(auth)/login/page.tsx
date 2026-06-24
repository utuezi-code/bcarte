'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconMail, IconLock, IconEye, IconEyeOff, IconUser, IconBuilding, IconArrowLeft, IconShieldCheck } from '@tabler/icons-react'
import { useUser } from '@/lib/user-context'

type AccountType = 'professionnel' | 'organisation' | null

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useUser()
  const [accountType, setAccountType] = useState<AccountType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountType) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Erreur de connexion'); return }
      const role = data.role === 'ORGANISATION' ? 'organisation' : 'professionnel'
      setRole(role)
      router.push(role === 'organisation' ? '/org/dashboard' : '/dashboard')
    } catch {
      setError('Erreur réseau, réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* ── Colonne gauche ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0C0A18] flex-col justify-between p-16">

        {/* Cercles décoratifs */}
        <div className="absolute top-[-120px] right-[-120px] w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.18) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 65%)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <span className="text-[22px] font-black text-white tracking-tight">bcarte</span>
        </div>

        {/* Texte central */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-widest text-[#6C47FF] uppercase">Plateforme africaine</p>
            <h2 className="text-[42px] font-black text-white leading-[1.1] tracking-tight">
              Votre identité<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.3)' }}>
                professionnelle
              </span><br />
              vérifiée.
            </h2>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-[280px]">
              Un profil crédible, des expériences confirmées, un réseau qui vous reconnaît.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-2">
            {[['12k+', 'Profils'], ['800+', 'Organisations'], ['95%', 'Vérifications']].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-black text-white">{val}</p>
                <p className="text-xs text-white/35 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card profil en bas */}
        <div className="relative z-10">
          <div className="rounded-2xl p-4 flex items-center gap-3.5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B7BFF 100%)' }}>
              KT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white">Kofi Mensah</p>
              <p className="text-[11px] text-white/40 truncate">Data Engineer · Accra, Ghana</p>
            </div>
            <div className="flex items-center gap-1 bg-[#6C47FF]/20 text-[#9B7BFF] text-[10px] font-semibold px-2 py-1 rounded-full">
              <IconShieldCheck size={10} />
              Vérifié
            </div>
          </div>
        </div>
      </div>

      {/* ── Colonne droite ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 lg:py-0">

        {/* Logo mobile */}
        <div className="lg:hidden mb-10 text-center">
          <span className="text-2xl font-black text-[#0C0A18] tracking-tight">bcarte</span>
        </div>

        <div className="w-full max-w-[360px] space-y-8">

          {/* Étape 1 — type de compte */}
          {!accountType && (
            <>
              <div>
                <h1 className="text-[28px] font-black text-[#0C0A18] tracking-tight">Connexion</h1>
                <p className="text-[14px] text-[#9CA3AF] mt-1">Choisissez votre espace</p>
              </div>

              <div className="space-y-3">
                {([
                  { type: 'professionnel', icon: IconUser,     label: 'Professionnel',  sub: 'Profil · CV · Vérifications' },
                  { type: 'organisation',  icon: IconBuilding, label: 'Organisation',   sub: 'Entreprise · Université · Institution' },
                ] as const).map(({ type, icon: Icon, label, sub }) => (
                  <button key={type} onClick={() => setAccountType(type)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-[#F0F0F0] hover:border-[#6C47FF] hover:bg-[#6C47FF]/[0.03] transition-all group text-left">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F7F8] group-hover:bg-[#6C47FF]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon size={18} className="text-[#9CA3AF] group-hover:text-[#6C47FF] transition-colors" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0C0A18]">{label}</p>
                      <p className="text-[12px] text-[#9CA3AF]">{sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-[13px] text-[#9CA3AF] text-center">
                Pas de compte ?{' '}
                <Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">
                  S&apos;inscrire
                </Link>
              </p>
            </>
          )}

          {/* Étape 2 — formulaire */}
          {accountType && (
            <>
              <div className="flex items-center gap-3">
                <button onClick={() => setAccountType(null)}
                  className="w-8 h-8 rounded-xl bg-[#F7F7F8] hover:bg-[#EEEEEE] flex items-center justify-center transition-colors">
                  <IconArrowLeft size={14} className="text-[#6B7280]" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#0C0A18] capitalize">{accountType}</span>
                </div>
              </div>

              <div>
                <h1 className="text-[28px] font-black text-[#0C0A18] tracking-tight">Bon retour.</h1>
                <p className="text-[14px] text-[#9CA3AF] mt-1">
                  {accountType === 'professionnel' ? 'Connectez-vous à votre profil' : 'Accédez au tableau de bord'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[14px] text-[#0C0A18] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C47FF] focus:bg-white transition-colors"
                    placeholder="vous@email.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wide">Mot de passe</label>
                    <a href="#" className="text-[12px] text-[#6C47FF] hover:underline">Oublié ?</a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 pr-11 text-[14px] text-[#0C0A18] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C47FF] focus:bg-white transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                      {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{error}</p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl text-[14px] font-bold text-white transition-opacity disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #8B6BFF 100%)' }}>
                  {loading ? 'Connexion…' : 'Se connecter →'}
                </button>
              </form>

              <p className="text-[13px] text-[#9CA3AF] text-center">
                {accountType === 'professionnel' ? (
                  <>Pas de compte ?{' '}<Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">Créer mon profil</Link></>
                ) : (
                  <>Organisation non inscrite ?{' '}<Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">Inscrire</Link></>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
