'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconMail, IconLock, IconEye, IconEyeOff, IconUser, IconBuilding, IconArrowLeft } from '@tabler/icons-react'
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
    <div className="min-h-screen bg-bg-light flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold text-primary">bcarte</span>
          <p className="text-text-secondary text-sm mt-2">Votre identité professionnelle vérifiée</p>
        </div>

        {/* Step 1 — choose account type */}
        {!accountType && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm space-y-5">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Se connecter</h1>
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

            <p className="text-center text-sm text-text-secondary pt-2">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">
                S&apos;inscrire
              </Link>
            </p>
          </div>
        )}

        {/* Step 2 — login form */}
        {accountType && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm space-y-5">

            {/* Back + account type indicator */}
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
              <h1 className="text-xl font-bold text-text-primary">Connexion</h1>
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
                <label htmlFor="password" className="label">Mot de passe</label>
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  Se souvenir de moi
                </label>
                <a href="#" className="text-primary font-medium hover:underline">Mot de passe oublié ?</a>
              </div>

              {error && (
                <p className="text-sm text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>

            {accountType === 'professionnel' && (
              <p className="text-center text-sm text-text-secondary">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Créer mon profil
                </Link>
              </p>
            )}
            {accountType === 'organisation' && (
              <p className="text-center text-sm text-text-secondary">
                Votre organisation n&apos;est pas encore sur bcarte ?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Inscrire mon organisation
                </Link>
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
