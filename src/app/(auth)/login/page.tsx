'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconArrowRight, IconShieldCheck } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/lib/user-context'

const fadeTrans = { duration: 0.3, ease: 'easeInOut' as const }
const stagger = { initial: {}, animate: { transition: { staggerChildren: 0.07 } } }
const item    = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }

export default function LoginPage() {
  const router = useRouter()
  const { setRole } = useUser()
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
            Votre identité<br />professionnelle,<br />
            <span className="text-[#6C47FF]">vérifiée.</span>
          </motion.h2>
          <motion.p variants={item} className="text-[15px] text-[#6B7280] leading-relaxed max-w-[320px]">
            Vérifiez et valorisez vos expériences professionnelles.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-2 pt-2">
            {['Vérification instantanée', 'CV intelligent', '12 000+ membres'].map(label => (
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
          Rejoignez 12 000+ professionnels vérifiés.
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
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-8">

            <motion.div variants={item} className="space-y-1">
              <h1 className="text-[28px] font-black text-[#0C0A18] tracking-tight">Bon retour.</h1>
              <p className="text-[14px] text-[#9CA3AF]">Connectez-vous à votre espace</p>
            </motion.div>

            <motion.form variants={stagger} onSubmit={submit} className="space-y-5">
              <motion.div variants={item} className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#374151]">Adresse email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="vous@email.com"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-[14px] text-[#0C0A18] placeholder:text-[#D1D5DB] outline-none focus:border-[#6C47FF] focus:ring-4 focus:ring-[#6C47FF]/10 bg-white transition-all" />
              </motion.div>

              <motion.div variants={item} className="space-y-1.5">
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
                  : <>Se connecter <IconArrowRight size={15} /></>
                }
              </motion.button>
            </motion.form>

            <motion.p variants={item} className="text-[13px] text-[#9CA3AF] text-center">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#6C47FF] font-semibold hover:underline">S&apos;inscrire</Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
