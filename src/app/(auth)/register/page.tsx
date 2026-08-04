'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconArrowRight } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/lib/user-context'

type Step = 'pick' | 'professionnel' | 'organisation'

const fadeUp   = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }
const fadeTrans = { duration: 0.3, ease: 'easeInOut' as const }
const stagger   = { initial: {}, animate: { transition: { staggerChildren: 0.07 } } }
const item      = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }

export default function RegisterPage() {
  const router = useRouter()
  const { setRole } = useUser()
  const [step, setStep]       = useState<Step>('pick')
  const [showPw, setShowPw]   = useState(false)
  const [fullName, setName]   = useState('')
  const [orgName, setOrgName] = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPw]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoad]    = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoad(true)
    try {
      const body = step === 'professionnel'
        ? { email, password, role: 'professionnel', fullName }
        : { email, password, role: 'organisation', name: orgName }
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Erreur lors de la création du compte'); return }
      const role = data.role === 'ORGANISATION' ? 'organisation' : 'professionnel'
      setRole(role)
      router.push(role === 'organisation' ? '/org/dashboard' : '/dashboard')
    } catch { setError('Erreur réseau.') }
    finally   { setLoad(false) }
  }

  return (
    <div className="min-h-screen flex">

      {/* Gauche */}
      <div className="hidden lg:flex w-[50%] bg-bg-light flex-col justify-between p-14 overflow-hidden">

        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="font-black text-lg text-text-primary tracking-tight">bcarte</span>
        </motion.div>

        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-5">
          <motion.h2 variants={item} className="text-[52px] font-black text-text-primary leading-[1.0] tracking-tight">
            Commencez<br />votre parcours,<br />
            <span className="text-primary">certifié.</span>
          </motion.h2>
          <motion.p variants={item} className="text-[15px] text-text-secondary leading-relaxed max-w-[320px]">
            Créez votre profil en quelques minutes et faites vérifier vos expériences par vos employeurs.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-2 pt-2">
            {['Gratuit', 'Sans carte bancaire', 'Prêt en 2 min'].map(label => (
              <span key={label} className="text-xs text-primary font-medium bg-primary-light px-3 py-1.5 rounded-full">
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-xs text-text-tertiary"
        >
          Déjà un compte ?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
        </motion.p>
      </div>

      {/* Droite */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 py-16">

        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:hidden mb-10"
        >
          <span className="font-black text-xl text-text-primary tracking-tight">bcarte</span>
        </motion.div>

        <div className="w-full max-w-[360px]">
          <AnimatePresence mode="wait">

            {/* Choix du type */}
            {step === 'pick' && (
              <motion.div key="pick" {...fadeUp} transition={fadeTrans} className="space-y-8">
                <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-1">
                  <motion.h1 variants={item} className="text-[28px] font-black text-text-primary tracking-tight">
                    Créer un compte
                  </motion.h1>
                  <motion.p variants={item} className="text-sm text-text-tertiary">
                    Quel est votre profil ?
                  </motion.p>
                </motion.div>

                <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                  {([
                    { value: 'professionnel' as const, label: 'Professionnel', sub: 'Gérez votre profil et vos vérifications' },
                    { value: 'organisation'  as const, label: 'Organisation',  sub: 'Entreprise, université, club, institution' },
                  ]).map(({ value, label, sub }) => (
                    <motion.button key={value} variants={item} onClick={() => setStep(value)}
                      whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-border hover:border-primary hover:bg-bg-light transition-colors group text-left">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{label}</p>
                        <p className="text-xs text-text-tertiary mt-0.5">{sub}</p>
                      </div>
                      <IconArrowRight size={16} className="text-text-tertiary group-hover:text-primary transition-colors flex-shrink-0 ml-3" />
                    </motion.button>
                  ))}
                </motion.div>

                <motion.p variants={item} className="text-sm text-text-tertiary text-center">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
                </motion.p>
              </motion.div>
            )}

            {/* Formulaire */}
            {step !== 'pick' && (
              <motion.div key="form" {...fadeUp} transition={fadeTrans} className="space-y-8">
                <motion.div variants={stagger} initial="initial" animate="animate">
                  <motion.button variants={item} onClick={() => setStep('pick')}
                    whileHover={{ x: -3 }}
                    className="text-sm text-text-tertiary hover:text-primary mb-6 transition-colors block">
                    ← Retour
                  </motion.button>
                  <motion.h1 variants={item} className="text-[28px] font-black text-text-primary tracking-tight">
                    {step === 'professionnel' ? 'Créer mon profil' : 'Inscrire mon organisation'}
                  </motion.h1>
                  <motion.p variants={item} className="text-sm text-text-tertiary mt-1 capitalize">
                    Espace {step}
                  </motion.p>
                </motion.div>

                <motion.form variants={stagger} initial="initial" animate="animate" onSubmit={submit} className="space-y-4">

                  <motion.div variants={item} className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary">
                      {step === 'professionnel' ? 'Nom complet' : "Nom de l'organisation"}
                    </label>
                    <input
                      type="text"
                      value={step === 'professionnel' ? fullName : orgName}
                      onChange={e => step === 'professionnel' ? setName(e.target.value) : setOrgName(e.target.value)}
                      required
                      placeholder={step === 'professionnel' ? 'Prénom Nom' : 'Nom de votre organisation'}
                      className="input h-11 rounded-xl"
                    />
                  </motion.div>

                  <motion.div variants={item} className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary">Adresse email</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="vous@email.com"
                      className="input h-11 rounded-xl"
                    />
                  </motion.div>

                  <motion.div variants={item} className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'} value={password} onChange={e => setPw(e.target.value)}
                        required minLength={8} placeholder="Minimum 8 caractères"
                        className="input h-11 rounded-xl pr-11"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-primary transition-colors">
                        {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                      </button>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-sm text-danger bg-red-50 border border-danger/20 rounded-xl px-4 py-3">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button variants={item} type="submit" disabled={loading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                    {loading
                      ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      : <>Créer mon compte <IconArrowRight size={15} /></>
                    }
                  </motion.button>

                  <motion.p variants={item} className="text-xs text-text-tertiary text-center leading-relaxed">
                    En créant un compte, vous acceptez nos{' '}
                    <a href="#" className="text-primary hover:underline">conditions d&apos;utilisation</a>
                    {' '}et notre{' '}
                    <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.
                  </motion.p>
                </motion.form>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-sm text-text-tertiary text-center">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
                </motion.p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
