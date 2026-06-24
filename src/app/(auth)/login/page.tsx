'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconArrowRight, IconShieldCheck, IconBriefcase, IconUsers } from '@tabler/icons-react'
import { useUser } from '@/lib/user-context'

type Step = 'pick' | 'professionnel' | 'organisation'

const PROFILES = [
  { initials: 'KM', name: 'Kofi Mensah',     role: 'Data Engineer',     country: '🇬🇭', verified: true  },
  { initials: 'AF', name: 'Aminata Fofana',  role: 'Directrice RH',     country: '🇨🇮', verified: true  },
  { initials: 'OD', name: 'Oumar Diop',      role: 'Product Manager',   country: '🇸🇳', verified: false },
]

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useUser()
  const [step, setStep]               = useState<Step>('pick')
  const [showPw, setShowPw]           = useState(false)
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Erreur de connexion'); return }
      const role = data.role === 'ORGANISATION' ? 'organisation' : 'professionnel'
      setRole(role)
      router.push(role === 'organisation' ? '/org/dashboard' : '/dashboard')
    } catch { setError('Erreur réseau.') }
    finally  { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* ══ LEFT — branding ══ */}
      <div className="hidden lg:flex w-[54%] relative overflow-hidden flex-col p-12 justify-between" style={{ background: '#6C47FF' }}>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <IconShieldCheck size={15} className="text-white" />
          </div>
          <span className="text-white font-black text-lg tracking-tight">bcarte</span>
        </div>

        {/* Main copy */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-[52px] font-black text-white leading-[1.0] tracking-[-2px]">
              Votre carrière,<br />certifiée.
            </h2>
            <p className="text-[15px] text-white/60 leading-relaxed max-w-[300px]">
              La plateforme africaine qui vérifie et valorise vos expériences professionnelles.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: IconShieldCheck, label: 'Vérification instantanée' },
              { icon: IconBriefcase,   label: 'CV intelligent' },
              { icon: IconUsers,       label: '12 000+ professionnels' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-white/80 bg-white/10">
                <Icon size={12} className="text-white" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Profile cards */}
        <div className="space-y-2.5">
          {PROFILES.map((p, i) => (
            <div key={p.initials}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/10"
              style={{ transform: `translateX(${i * 12}px)`, opacity: 1 - i * 0.25 }}>
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold bg-white/20 text-white">
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white leading-none">{p.name}</p>
                <p className="text-[11px] text-white/50 mt-0.5">{p.country} {p.role}</p>
              </div>
              {p.verified && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full">
                  <IconShieldCheck size={9} />
                  Vérifié
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT — form ══ */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">

        {/* Mobile logo */}
        <div className="lg:hidden mb-12 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#6C47FF] flex items-center justify-center">
            <IconShieldCheck size={15} className="text-white" />
          </div>
          <span className="text-[#080612] font-black text-lg tracking-tight">bcarte</span>
        </div>

        <div className="w-full max-w-[340px]">

          {/* ── Step : pick ── */}
          {step === 'pick' && (
            <div className="space-y-7">
              <div>
                <h1 className="text-[30px] font-black text-[#080612] tracking-tight leading-tight">Connexion</h1>
                <p className="text-[14px] text-[#9CA3AF] mt-1">Quel est votre espace ?</p>
              </div>

              <div className="space-y-2.5">
                {([
                  {
                    value: 'professionnel' as const,
                    title: 'Professionnel',
                    sub: 'Gérez votre profil et vérifications',
                    color: '#6C47FF',
                  },
                  {
                    value: 'organisation' as const,
                    title: 'Organisation',
                    sub: 'Entreprise, université, institution',
                    color: '#0C0A18',
                  },
                ]).map(({ value, title, sub, color }) => (
                  <button key={value} onClick={() => setStep(value)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-[#F0F0F0] hover:border-[#6C47FF]/40 hover:bg-[#6C47FF]/[0.025] transition-all group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}15` }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#080612]">{title}</p>
                        <p className="text-[12px] text-[#9CA3AF]">{sub}</p>
                      </div>
                    </div>
                    <IconArrowRight size={16} className="text-[#D1D5DB] group-hover:text-[#6C47FF] transition-colors" />
                  </button>
                ))}
              </div>

              <p className="text-[13px] text-[#9CA3AF] text-center">
                Première fois ?{' '}
                <Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">Créer un compte</Link>
              </p>
            </div>
          )}

          {/* ── Step : form ── */}
          {step !== 'pick' && (
            <div className="space-y-7">
              <div>
                <button onClick={() => setStep('pick')}
                  className="text-[12px] text-[#9CA3AF] hover:text-[#6C47FF] transition-colors mb-5 flex items-center gap-1">
                  ← Retour
                </button>
                <h1 className="text-[30px] font-black text-[#080612] tracking-tight leading-tight">Bon retour.</h1>
                <p className="text-[14px] text-[#9CA3AF] mt-1 capitalize">Espace {step}</p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-semibold text-[#6B7280] tracking-wide">Adresse email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="vous@email.com"
                    className="w-full h-[46px] rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 text-[14px] text-[#080612] placeholder:text-[#C9CBD0] outline-none focus:ring-2 focus:ring-[#6C47FF]/25 focus:border-[#6C47FF] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[12px] font-semibold text-[#6B7280] tracking-wide">Mot de passe</label>
                    <a href="#" className="text-[12px] text-[#6C47FF] hover:underline">Oublié ?</a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                      placeholder="••••••••"
                      className="w-full h-[46px] rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 pr-11 text-[14px] text-[#080612] placeholder:text-[#C9CBD0] outline-none focus:ring-2 focus:ring-[#6C47FF]/25 focus:border-[#6C47FF] focus:bg-white transition-all"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B0B3BB] hover:text-[#6C47FF] transition-colors">
                      {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full h-[46px] rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B7BFF 100%)' }}>
                  {loading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>Se connecter <IconArrowRight size={15} /></>
                  )}
                </button>
              </form>

              <p className="text-[13px] text-[#9CA3AF] text-center">
                {step === 'professionnel' ? (
                  <>Pas de compte ?{' '}<Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">Créer mon profil</Link></>
                ) : (
                  <>Pas encore inscrit ?{' '}<Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">Inscrire mon organisation</Link></>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
