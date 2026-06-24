'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconArrowRight, IconShieldCheck } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/lib/user-context'

type Step = 'pick' | 'professionnel' | 'organisation'

const fadeUp = {
  initial:   { opacity: 0, y: 16 },
  animate:   { opacity: 1, y: 0  },
  exit:      { opacity: 0, y: -8 },
}
const fadeTrans = { duration: 0.3, ease: 'easeInOut' as const }

const stagger = { initial: {}, animate: { transition: { staggerChildren: 0.07 } } }
const item    = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }

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

      {/* ── Gauche ── */}
      <div className="hidden lg:flex w-[50%] bg-[#F7F6FF] flex-col justify-between p-14 overflow-hidden">

        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-xl bg-[#6C47FF] flex items-center justify-center">
            <IconShieldCheck size={16} className="text-white" />
          </div>
          <span className="font-black text-[18px] text-[#0C0A18] tracking-tight">bcarte</span>
        </motion.div>

        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-5">
          <motion.h2 variants={item} className="text-[52px] font-black text-[#0C0A18] leading-[1.0] tracking-tight">
            Commencez<br />votre parcours,<br />
            <span className="text-[#6C47FF]">certifié.</span>
          </motion.h2>
          <motion.p variants={item} className="text-[15px] text-[#6B7280] leading-relaxed max-w-[320px]">
            Créez votre profil en quelques minutes et faites vérifier vos expériences par vos employeurs.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-2 pt-2">
            {['Gratuit', 'Sans carte bancaire', 'Prêt en 2 min'].map(label => (
              <span key={label} className="text-[12px] text-[#6C47FF] font-medium bg-[#6C47FF]/10 px-3 py-1.5 rounded-full">
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-[12px] text-[#9CA3AF]"
        >
          Déjà un compte ?{' '}
          <Link href="/login" className="text-[#6C47FF] font-semibold hover:underline">Se connecter</Link>
        </motion.p>
      </div>

      {/* ── Droite ── */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-8 py-16">

        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:hidden mb-10 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-xl bg-[#6C47FF] flex items-center justify-center">
            <IconShieldCheck size={16} className="text-white" />
          </div>
          <span className="font-black text-[18px] text-[#0C0A18] tracking-tight">bcarte</span>
        </motion.div>

        <div className="w-full max-w-[360px]">
          <AnimatePresence mode="wait">

            {/* Pick */}
            {step === 'pick' && (
              <motion.div key="pick" {...fadeUp} transition={fadeTrans} className="space-y-8">
                <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-1">
                  <motion.h1 variants={item} className="text-[28px] font-black text-[#0C0A18] tracking-tight">
                    Créer un compte
                  </motion.h1>
                  <motion.p variants={item} className="text-[14px] text-[#9CA3AF]">
                    Quel est votre profil ?
                  </motion.p>
                </motion.div>

                <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                  {([
                    { value: 'professionnel' as const, label: 'Professionnel', sub: 'Gérez votre profil et vos vérifications' },
                    { value: 'organisation'  as const, label: 'Organisation',  sub: 'Entreprise, université, institution' },
                  ]).map(({ value, label, sub }) => (
                    <motion.button key={value} variants={item} onClick={() => setStep(value)}
                      whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-[#EBEBF0] hover:border-[#6C47FF] hover:bg-[#F7F6FF] transition-colors group text-left">
                      <div>
                        <p className="text-[14px] font-semibold text-[#0C0A18]">{label}</p>
                        <p className="text-[12px] text-[#9CA3AF] mt-0.5">{sub}</p>
                      </div>
                      <IconArrowRight size={16} className="text-[#D1D5DB] group-hover:text-[#6C47FF] transition-colors flex-shrink-0 ml-3" />
                    </motion.button>
                  ))}
                </motion.div>

                <motion.p variants={item} className="text-[13px] text-[#9CA3AF] text-center">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-[#6C47FF] font-semibold hover:underline">Se connecter</Link>
                </motion.p>
              </motion.div>
            )}

            {/* Form */}
            {step !== 'pick' && (
              <motion.div key="form" {...fadeUp} transition={fadeTrans} className="space-y-8">
                <motion.div variants={stagger} initial="initial" animate="animate">
                  <motion.button variants={item} onClick={() => setStep('pick')}
                    whileHover={{ x: -3 }}
                    className="text-[13px] text-[#9CA3AF] hover:text-[#6C47FF] mb-6 transition-colors block">
                    ← Retour
                  </motion.button>
                  <motion.h1 variants={item} className="text-[28px] font-black text-[#0C0A18] tracking-tight">
                    {step === 'professionnel' ? 'Créer mon profil' : 'Inscrire mon organisation'}
                  </motion.h1>
                  <motion.p variants={item} className="text-[14px] text-[#9CA3AF] mt-1 capitalize">
                    Espace {step}
                  </motion.p>
                </motion.div>

                <motion.form
                  variants={stagger} initial="initial" animate="animate"
                  onSubmit={submit} className="space-y-4"
                >
                  {/* Nom */}
                  <motion.div variants={item} className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#374151]">
                      {step === 'professionnel' ? 'Nom complet' : "Nom de l'organisation"}
                    </label>
                    <input
                      type="text"
                      value={step === 'professionnel' ? fullName : orgName}
                      onChange={e => step === 'professionnel' ? setName(e.target.value) : setOrgName(e.target.value)}
                      required
                      placeholder={step === 'professionnel' ? 'Prénom Nom' : 'Nom de votre organisation'}
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-[14px] text-[#0C0A18] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C47FF] focus:ring-4 focus:ring-[#6C47FF]/10 bg-white transition-all"
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={item} className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#374151]">Adresse email</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="vous@email.com"
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-[14px] text-[#0C0A18] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C47FF] focus:ring-4 focus:ring-[#6C47FF]/10 bg-white transition-all"
                    />
                  </motion.div>

                  {/* Mot de passe */}
                  <motion.div variants={item} className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#374151]">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'} value={password} onChange={e => setPw(e.target.value)}
                        required minLength={8} placeholder="Minimum 8 caractères"
                        className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 pr-11 text-[14px] text-[#0C0A18] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C47FF] focus:ring-4 focus:ring-[#6C47FF]/10 bg-white transition-all"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0C0C8] hover:text-[#6C47FF] transition-colors">
                        {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                      </button>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button variants={item} type="submit" disabled={loading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full h-11 rounded-xl bg-[#6C47FF] hover:bg-[#5B38EE] text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                    {loading
                      ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      : <>Créer mon compte <IconArrowRight size={15} /></>
                    }
                  </motion.button>

                  <motion.p variants={item} className="text-[11px] text-[#9CA3AF] text-center leading-relaxed">
                    En créant un compte, vous acceptez nos{' '}
                    <a href="#" className="text-[#6C47FF] hover:underline">conditions d&apos;utilisation</a>
                    {' '}et notre{' '}
                    <a href="#" className="text-[#6C47FF] hover:underline">politique de confidentialité</a>.
                  </motion.p>
                </motion.form>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="text-[13px] text-[#9CA3AF] text-center">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-[#6C47FF] font-semibold hover:underline">Se connecter</Link>
                </motion.p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
