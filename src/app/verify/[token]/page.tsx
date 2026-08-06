'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { IconShieldCheck, IconLoader2, IconCircleCheck, IconAlertCircle, IconBuilding } from '@tabler/icons-react'
import Link from 'next/link'

export default function VerifyTokenPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()

  const [org,       setOrg]       = useState<any>(null)
  const [checking,  setChecking]  = useState(true)
  const [valid,     setValid]     = useState(false)
  const [confirming,setConfirming]= useState(false)
  const [result,    setResult]    = useState<{ confirmed: number; orgName: string } | null>(null)
  const [error,     setError]     = useState('')

  useEffect(() => {
    fetch(`/api/verify-link/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.valid) { setOrg(d.org); setValid(true) }
        else setError(d.error ?? 'Lien invalide')
        setChecking(false)
      })
      .catch(() => { setError('Erreur réseau'); setChecking(false) })
  }, [token])

  const confirm = async () => {
    setConfirming(true)
    const res = await fetch(`/api/verify-link/${token}`, { method: 'POST' })
    const data = await res.json()
    if (res.status === 401) {
      router.push(`/login?redirect=/verify/${token}`)
      return
    }
    if (!res.ok) { setError(data.error ?? 'Erreur'); setConfirming(false); return }
    setResult(data)
    setConfirming(false)
  }

  if (checking) return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center">
      <IconLoader2 size={28} className="animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">

        {/* Card */}
        <div className="card text-center space-y-5 p-8">

          {result ? (
            /* ── Success state ── */
            <>
              <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] flex items-center justify-center mx-auto">
                <IconCircleCheck size={32} className="text-success" />
              </div>
              <div>
                <p className="font-black text-text-primary text-lg">Vérifiées !</p>
                <p className="text-sm text-text-secondary mt-1">
                  {result.confirmed > 0
                    ? <>{result.confirmed} demande{result.confirmed > 1 ? 's ont été confirmées' : ' a été confirmée'} par <span className="font-semibold">{result.orgName}</span></>
                    : <>Aucune demande en attente pour <span className="font-semibold">{result.orgName}</span>. Faites d&apos;abord une demande de vérification depuis votre profil.</>
                  }
                </p>
              </div>
              <Link href="/dashboard/profile?tab=experiences"
                className="btn-primary w-full justify-center">
                Voir mon profil
              </Link>
            </>
          ) : !valid ? (
            /* ── Invalid link ── */
            <>
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                <IconAlertCircle size={32} className="text-danger" />
              </div>
              <div>
                <p className="font-black text-text-primary text-lg">Lien invalide</p>
                <p className="text-sm text-text-secondary mt-1">{error}</p>
              </div>
              <Link href="/dashboard" className="btn-secondary w-full justify-center">
                Retour
              </Link>
            </>
          ) : (
            /* ── Confirm state ── */
            <>
              {/* Org logo */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black mx-auto"
                style={{ backgroundColor: org?.logoColor ?? '#6C47FF' }}>
                {org?.name ? org.name.slice(0, 2).toUpperCase() : <IconBuilding size={28} />}
              </div>

              <div>
                <p className="font-black text-text-primary text-lg">{org?.name}</p>
                <p className="text-sm text-text-secondary mt-1">
                  vous invite à faire vérifier vos expériences professionnelles
                </p>
              </div>

              <div className="text-left rounded-xl bg-primary-light/50 border border-primary/15 p-4 space-y-2">
                {[
                  'Vos expériences chez cet employeur seront confirmées instantanément',
                  'Le badge "Vérifié" apparaîtra sur votre profil public',
                  'Vos futures demandes vers cet employeur seront auto-confirmées',
                ].map(t => (
                  <p key={t} className="text-xs text-text-secondary flex items-start gap-2">
                    <IconShieldCheck size={13} className="text-primary flex-shrink-0 mt-0.5" />
                    {t}
                  </p>
                ))}
              </div>

              {error && (
                <p className="text-xs text-danger bg-red-50 border border-danger/15 rounded-xl px-3 py-2">{error}</p>
              )}

              <button onClick={confirm} disabled={confirming}
                className="btn-primary w-full justify-center">
                {confirming
                  ? <IconLoader2 size={16} className="animate-spin" />
                  : <IconShieldCheck size={16} />}
                Confirmer mes expériences
              </button>

              <p className="text-[11px] text-text-tertiary">
                Vous devez être connecté à votre compte professionnel
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
