export type TrustLevel = 0 | 1 | 2 | 3 | 4 | 5

export function trustScore(confirmedVerifications: any[]): TrustLevel {
  const n = confirmedVerifications.length
  if (n === 0) return 0
  const hasExp = confirmedVerifications.some((v: any) => v.type === 'EXPÉRIENCE')
  const hasEdu = confirmedVerifications.some((v: any) => v.type === 'FORMATION')
  const byVerifiedOrg = confirmedVerifications.some((v: any) => v.organisation?.verified === true)
  if (n >= 3 && hasExp && hasEdu && byVerifiedOrg) return 5
  if (hasExp && hasEdu) return 4
  if (n >= 2) return 3
  if (n === 1) return 2
  return 1
}

export const TRUST_LABELS: Record<TrustLevel, string> = {
  0: 'Non vérifié',
  1: 'En cours',
  2: 'Partiellement vérifié',
  3: 'Fiable',
  4: 'Très fiable',
  5: 'Profil certifié',
}

export const TRUST_COLORS: Record<TrustLevel, string> = {
  0: '#D1D5DB',
  1: '#D97706',
  2: '#D97706',
  3: '#2563EB',
  4: '#059669',
  5: '#6C47FF',
}
