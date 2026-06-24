'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconArrowRight, IconShieldCheck } from '@tabler/icons-react'
import { useUser } from '@/lib/user-context'

type Step = 'pick' | 'professionnel' | 'organisation'

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useUser()
  const [step, setStep]     = useState<Step>('pick')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail]   = useState('')
  const [password, setPw]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoad]  = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoad(true)
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
    finally  { setLoad(false) }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Gauche ── */}
      <div className="hidden lg:flex w-[50%] bg-[#F7F6FF] flex-col justify-between p-14">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#6C47FF] flex items-center justify-center">
            <IconShieldCheck size={16} className="text-white" />
          </div>
          <span className="font-black text-[18px] text-[#0C0A18] tracking-tight">bcarte</span>
        </div>

        {/* Texte central */}
        <div className="space-y-5">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#6C47FF] uppercase">Plateforme africaine</p>
          <h2 className="text-[48px] font-black text-[#0C0A18] leading-[1.05] tracking-tight">
            Votre identité<br />professionnelle,<br />
            <span className="text-[#6C47FF]">vérifiée.</span>
          </h2>
          <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-[320px]">
            Des expériences confirmées par les entreprises. Un profil que vos recruteurs peuvent faire confiance.
          </p>
        </div>

        {/* Card profil */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBEBF0] max-w-[320px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#6C47FF] flex items-center justify-center text-white font-bold text-sm">
              AM
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#0C0A18]">Aïcha Maïga</p>
              <p className="text-[12px] text-[#9CA3AF]">Product Designer · Bamako, Mali</p>
            </div>
            <div className="ml-auto flex items-center gap-1 bg-[#F0EDFF] text-[#6C47FF] text-[11px] font-semibold px-2.5 py-1 rounded-full">
              <IconShieldCheck size={11} />
              Vérifié
            </div>
          </div>
          <div className="flex gap-2">
            {['Figma', 'UX Research', 'Prototyping'].map(s => (
              <span key={s} className="text-[11px] text-[#6B7280] bg-[#F3F4F6] px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Droite ── */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 py-16">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#6C47FF] flex items-center justify-center">
            <IconShieldCheck size={16} className="text-white" />
          </div>
          <span className="font-black text-[18px] text-[#0C0A18] tracking-tight">bcarte</span>
        </div>

        <div className="w-full max-w-[360px]">

          {/* Pick */}
          {step === 'pick' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[28px] font-black text-[#0C0A18] tracking-tight">Se connecter</h1>
                <p className="text-[14px] text-[#9CA3AF] mt-1">Choisissez votre espace</p>
              </div>

              <div className="space-y-3">
                {([
                  { value: 'professionnel' as const, label: 'Professionnel', sub: 'Gérez votre profil et vos vérifications' },
                  { value: 'organisation'  as const, label: 'Organisation',  sub: 'Entreprise, université, institution' },
                ]).map(({ value, label, sub }) => (
                  <button key={value} onClick={() => setStep(value)}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-[#EBEBF0] hover:border-[#6C47FF] hover:bg-[#F7F6FF] transition-all group text-left">
                    <div>
                      <p className="text-[14px] font-semibold text-[#0C0A18]">{label}</p>
                      <p className="text-[12px] text-[#9CA3AF] mt-0.5">{sub}</p>
                    </div>
                    <IconArrowRight size={16} className="text-[#D1D5DB] group-hover:text-[#6C47FF] transition-colors flex-shrink-0 ml-3" />
                  </button>
                ))}
              </div>

              <p className="text-[13px] text-[#9CA3AF] text-center">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">S&apos;inscrire</Link>
              </p>
            </div>
          )}

          {/* Form */}
          {step !== 'pick' && (
            <div className="space-y-8">
              <div>
                <button onClick={() => setStep('pick')}
                  className="text-[13px] text-[#9CA3AF] hover:text-[#6C47FF] mb-6 transition-colors">
                  ← Retour
                </button>
                <h1 className="text-[28px] font-black text-[#0C0A18] tracking-tight">Bon retour.</h1>
                <p className="text-[14px] text-[#9CA3AF] mt-1 capitalize">Espace {step}</p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#374151]">Adresse email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="vous@email.com"
                    className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-[14px] text-[#0C0A18] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C47FF] focus:ring-4 focus:ring-[#6C47FF]/10 bg-white transition-all" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-[12px] font-semibold text-[#374151]">Mot de passe</label>
                    <a href="#" className="text-[12px] text-[#6C47FF] hover:underline">Oublié ?</a>
                  </div>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPw(e.target.value)} required
                      placeholder="••••••••"
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 pr-11 text-[14px] text-[#0C0A18] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C47FF] focus:ring-4 focus:ring-[#6C47FF]/10 bg-white transition-all" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0C0C8] hover:text-[#6C47FF] transition-colors">
                      {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#6C47FF] hover:bg-[#5B38EE] text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 active:scale-[0.98]">
                  {loading
                    ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : <>Se connecter <IconArrowRight size={15} /></>
                  }
                </button>
              </form>

              <p className="text-[13px] text-[#9CA3AF] text-center">
                {step === 'professionnel'
                  ? <><span>Pas de compte ?</span>{' '}<Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">Créer mon profil</Link></>
                  : <><span>Pas inscrit ?</span>{' '}<Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">Inscrire mon organisation</Link></>
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
