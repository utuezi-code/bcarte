'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold text-primary">bcarte</span>
          <p className="text-text-secondary text-sm mt-2">Votre identité professionnelle vérifiée</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-card-lg p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-text-primary mb-6">Se connecter</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">Adresse email</label>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-9"
                  placeholder="vous@email.com"
                  required
                />
              </div>
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
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
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
              <a href="#" className="text-primary hover:text-primary-hover font-medium">Mot de passe oublié ?</a>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3">
              Se connecter
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary hover:text-primary-hover font-medium">
              Créer mon compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
