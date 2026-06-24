'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  IconMail, IconLock, IconUser, IconBriefcase,
  IconBuilding, IconBuildingBank, IconCheck
} from '@tabler/icons-react'

type Role = 'professionnel' | 'recruteur' | 'institution'

const ROLES = [
  {
    id: 'professionnel' as Role,
    label: 'Professionnel',
    description: 'Gérez votre profil et générez votre CV',
    icon: IconUser,
  },
  {
    id: 'recruteur' as Role,
    label: 'Recruteur',
    description: 'Recherchez et contactez des talents',
    icon: IconBriefcase,
  },
  {
    id: 'institution' as Role,
    label: 'Institution',
    description: 'Vérifiez les expériences et diplômes',
    icon: IconBuildingBank,
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role>('professionnel')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold text-primary">bcarte</span>
          <p className="text-text-secondary text-sm mt-2">Créez votre identité professionnelle vérifiée</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-card-lg p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-text-primary mb-6">Créer mon compte</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <p className="label">Je suis un(e)</p>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((role) => {
                  const Icon = role.icon
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-card border-2 transition-all text-center ${
                        selectedRole === role.id
                          ? 'border-primary bg-primary-light'
                          : 'border-[#E5E7EB] hover:border-primary-border bg-white'
                      }`}
                    >
                      {selectedRole === role.id && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <IconCheck size={10} className="text-white" />
                        </span>
                      )}
                      <Icon size={20} className={selectedRole === role.id ? 'text-primary' : 'text-text-secondary'} />
                      <span className={`text-xs font-medium ${selectedRole === role.id ? 'text-primary' : 'text-text-secondary'}`}>
                        {role.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="label">Nom complet</label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input pl-9"
                  placeholder="Prénom Nom"
                  required
                />
              </div>
            </div>

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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-9"
                  placeholder="Minimum 8 caractères"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3">
              Créer mon compte
            </button>

            <p className="text-xs text-text-tertiary text-center">
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="text-primary hover:underline">conditions d&apos;utilisation</a>
              {' '}et notre{' '}
              <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.
            </p>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
