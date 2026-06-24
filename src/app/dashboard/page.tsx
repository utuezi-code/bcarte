import Link from 'next/link'
import {
  IconUser, IconFileText, IconCreditCard, IconEye,
  IconCircleCheck, IconClock, IconTrendingUp, IconChevronRight
} from '@tabler/icons-react'
import { CURRENT_USER } from '@/lib/mock-data'

export default function DashboardPage() {
  const user = CURRENT_USER

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-[28px] font-bold text-text-primary">
          Bonjour, {user.fullName.split(' ')[0]} 👋
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Voici un aperçu de votre activité sur bcarte
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-text-secondary">Vues ce mois</p>
              <p className="text-2xl font-bold text-text-primary mt-1">247</p>
            </div>
            <div className="w-9 h-9 bg-primary-light rounded-card flex items-center justify-center">
              <IconEye size={18} className="text-primary" />
            </div>
          </div>
          <p className="text-xs text-success mt-2 flex items-center gap-1">
            <IconTrendingUp size={12} />
            +18% vs mois dernier
          </p>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-text-secondary">Compétences</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{user.skills.length}<span className="text-base font-normal text-text-tertiary">/5</span></p>
            </div>
            <div className="w-9 h-9 bg-secondary-light rounded-card flex items-center justify-center">
              <IconCircleCheck size={18} className="text-secondary" />
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-2">Profil optimisé</p>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-text-secondary">Vérifications</p>
              <p className="text-2xl font-bold text-text-primary mt-1">3<span className="text-base font-normal text-text-tertiary">/5</span></p>
            </div>
            <div className="w-9 h-9 bg-success-light rounded-card flex items-center justify-center">
              <IconCircleCheck size={18} className="text-success" />
            </div>
          </div>
          <p className="text-xs text-[#D97706] mt-2 flex items-center gap-1">
            <IconClock size={12} />
            1 en attente
          </p>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-text-secondary">Profil complet</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{user.completionPercent}<span className="text-base font-normal text-text-tertiary">%</span></p>
            </div>
            <div className="w-9 h-9 bg-primary-light rounded-card flex items-center justify-center">
              <IconUser size={18} className="text-primary" />
            </div>
          </div>
          <div className="mt-2 bg-[#F3F4F6] rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{ width: `${user.completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="section-title">Actions rapides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/dashboard/profile" className="card hover:border-primary-border hover:shadow-sm transition-all group">
              <div className="w-10 h-10 bg-primary-light rounded-card flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <IconUser size={20} className="text-primary group-hover:text-white" />
              </div>
              <p className="font-semibold text-text-primary text-sm">Modifier mon profil</p>
              <p className="text-xs text-text-secondary mt-1">Mettez à jour vos informations</p>
            </Link>

            <Link href="/dashboard/cv" className="card hover:border-primary-border hover:shadow-sm transition-all group">
              <div className="w-10 h-10 bg-secondary-light rounded-card flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-white transition-colors">
                <IconFileText size={20} className="text-secondary group-hover:text-white" />
              </div>
              <p className="font-semibold text-text-primary text-sm">Générer un CV</p>
              <p className="text-xs text-text-secondary mt-1">Adapté à une offre par IA</p>
            </Link>

            <Link href="/dashboard/nfc" className="card hover:border-primary-border hover:shadow-sm transition-all group">
              <div className="w-10 h-10 bg-success-light rounded-card flex items-center justify-center mb-3 group-hover:bg-success group-hover:text-white transition-colors">
                <IconCreditCard size={20} className="text-success group-hover:text-white" />
              </div>
              <p className="font-semibold text-text-primary text-sm">Carte NFC</p>
              <p className="text-xs text-text-secondary mt-1">Commander ma carte physique</p>
            </Link>
          </div>

          {/* Pending verifications */}
          <div className="card mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary text-sm">Vérifications en attente</h3>
              <Link href="/dashboard/profile" className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
                Voir tout <IconChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#FFFBEB] rounded-card border border-[#FDE68A]">
                <IconClock size={16} className="text-[#D97706] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Master en Génie Informatique</p>
                  <p className="text-xs text-text-secondary">École Polytechnique de Thiès · Envoyée le 10 juin 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-success-light rounded-card border border-[#A7F3D0]">
                <IconCircleCheck size={16} className="text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Ingénieur Logiciel Senior</p>
                  <p className="text-xs text-success">Orange Digital Center a confirmé votre expérience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile preview */}
        <div className="space-y-3">
          <h2 className="section-title">Mon profil public</h2>
          <div className="card">
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mb-3">
                AD
              </div>
              <p className="font-semibold text-text-primary">{user.fullName}</p>
              <p className="text-sm text-text-secondary mt-0.5">{user.title}</p>
              <p className="text-xs text-text-tertiary mt-1">{user.city}, {user.country}</p>
              <span className="badge-verified mt-2">
                <IconCircleCheck size={12} />
                Vérifié
              </span>
              <div className="flex flex-wrap gap-1 justify-center mt-3">
                {user.skills.slice(0, 3).map((skill) => (
                  <span key={skill.id} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-badge font-medium">
                    {skill.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-[#E5E7EB] mt-4 pt-4">
              <Link
                href={`/p/${user.publicUrlSlug}`}
                className="btn-secondary w-full justify-center text-xs py-2"
              >
                Voir mon profil public
              </Link>
            </div>
          </div>

          <div className="card">
            <p className="text-xs font-medium text-text-secondary mb-1">Statut de disponibilité</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm font-medium text-text-primary">Disponible</span>
            </div>
            <p className="text-xs text-text-tertiary mt-1">Visible dans l'annuaire des profils</p>
          </div>
        </div>
      </div>
    </div>
  )
}
