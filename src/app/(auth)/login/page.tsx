'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  IconMail, IconLock, IconEye, IconEyeOff, IconUser, IconBuilding,
  IconArrowLeft, IconShieldCheck, IconBriefcase, IconStar,
} from '@tabler/icons-react'
import { useUser } from '@/lib/user-context'

type AccountType = 'professionnel' | 'organisation' | null

const FEATURES = [
  {
    icon: IconShieldCheck,
    title: 'Identité vérifiée',
    desc: 'Chaque expérience est confirmée par l'entreprise concernée',
  },
  {
    icon: IconBriefcase,
    title: 'CV vivant',
    desc: 'Un profil toujours à jour, partageable en un lien ou un QR code',
  },
  {
    icon: IconStar,
    title: 'Réseau africain',
    desc: 'Connectez-vous aux organisations et talents du continent',
  },
]

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
      if (!res.ok) {
        setError(data.error ?? 'Erreur de connexion')
        return
      }
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
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel — hero ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between px-14 py-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0C0A18 0%, #1a1040 55%, #2d1a6e 100%)' }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6C47FF 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6C47FF 0%, transparent 70%)' }} />
          {/* Grid dots */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <span className="text-3xl font-extrabold text-white tracking-tight">bcarte</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-10">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Votre identité<br />professionnelle<br />
              <span style={{ color: '#A78BFA' }}>vérifiée.</span>
            </h2>
            <p className="mt-4 text-base text-white/60 max-w-xs leading-relaxed">
              Construisez une présence professionnelle crédible, reconnue par vos employeurs et partenaires.
            </p>
          </div>

          <div className="space-y-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(108,71,255,0.25)' }}>
                  <Icon size={20} style={{ color: '#A78BFA' }} />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-xs text-white/50 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile card mockup */}
        <div className="relative z-10">
          <div className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6C47FF, #A78BFA)' }}>
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Aïssatou Diallo</p>
              <p className="text-xs text-white/50 truncate">Ingénieure logiciel · Dakar, Sénégal</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
              style={{ background: 'rgba(108,71,255,0.3)', color: '#A78BFA' }}>
              <IconShieldCheck size={11} />
              Vérifié
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-bg-light">

        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-8">
          <span className="text-3xl font-extrabold text-primary">bcarte</span>
          <p className="text-text-secondary text-sm mt-1">Votre identité professionnelle vérifiée</p>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Step 1 — choose account type */}
          {!accountType && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Se connecter</h1>
                <p className="text-sm text-text-secondary mt-1">Choisissez votre type de compte</p>
              </div>

              <button
                onClick={() => setAccountType('professionnel')}
                className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-[#E5E7EB] hover:border-primary hover:bg-primary-light/30 transition-all text-left group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <IconUser size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Professionnel</p>
                  <p className="text-sm text-text-secondary mt-0.5">Gérez votre profil, vérifications et CV</p>
                </div>
              </button>

              <button
                onClick={() => setAccountType('organisation')}
                className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-[#E5E7EB] hover:border-primary hover:bg-primary-light/30 transition-all text-left group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0C0A18]/10 transition-colors">
                  <IconBuilding size={22} className="text-text-secondary group-hover:text-[#0C0A18]" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Organisation</p>
                  <p className="text-sm text-text-secondary mt-0.5">Entreprise, université ou institution</p>
                </div>
              </button>

              <p className="text-center text-sm text-text-secondary pt-1">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  S&apos;inscrire gratuitement
                </Link>
              </p>
            </div>
          )}

          {/* Step 2 — login form */}
          {accountType && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm space-y-5">

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAccountType(null)}
                  className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-text-secondary transition-colors"
                  aria-label="Retour"
                >
                  <IconArrowLeft size={15} />
                </button>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${accountType === 'professionnel' ? 'bg-primary-light' : 'bg-[#F3F4F6]'}`}>
                    {accountType === 'professionnel'
                      ? <IconUser size={13} className="text-primary" />
                      : <IconBuilding size={13} className="text-text-secondary" />
                    }
                  </div>
                  <span className="text-sm font-semibold text-text-primary capitalize">{accountType}</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-text-primary">Connexion</h1>
                <p className="text-sm text-text-secondary mt-1">
                  {accountType === 'professionnel'
                    ? 'Accédez à votre espace professionnel'
                    : 'Accédez au tableau de bord de votre organisation'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="label">
                    {accountType === 'organisation' ? 'Email professionnel' : 'Adresse email'}
                  </label>
                  <div className="relative">
                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-9"
                      placeholder={accountType === 'organisation' ? 'contact@organisation.com' : 'vous@email.com'}
                      required
                    />
                  </div>
                  {accountType === 'organisation' && (
                    <p className="text-xs text-text-tertiary mt-1.5">
                      Utilisez l&apos;adresse email de votre domaine pour une vérification automatique
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="label mb-0">Mot de passe</label>
                    <a href="#" className="text-xs text-primary font-medium hover:underline">Mot de passe oublié ?</a>
                  </div>
                  <div className="relative">
                    <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-9 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                  {loading ? 'Connexion…' : 'Se connecter'}
                </button>
              </form>

              <p className="text-center text-sm text-text-secondary">
                {accountType === 'professionnel' ? (
                  <>Pas encore de compte ?{' '}<Link href="/register" className="text-primary font-medium hover:underline">Créer mon profil</Link></>
                ) : (
                  <>Votre organisation n&apos;est pas encore sur bcarte ?{' '}<Link href="/register" className="text-primary font-medium hover:underline">Inscrire mon organisation</Link></>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
