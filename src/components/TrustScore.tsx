'use client'
import { IconShieldCheck, IconShield } from '@tabler/icons-react'
import { trustScore, TRUST_LABELS, TRUST_COLORS, TrustLevel } from '@/lib/trust-score'

interface Props {
  verifications: any[]   // already filtered to CONFIRMEE
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export default function TrustScore({ verifications, size = 'sm', showLabel = false }: Props) {
  const score = trustScore(verifications) as TrustLevel
  if (score === 0) return null

  const color = TRUST_COLORS[score]
  const label = TRUST_LABELS[score]
  const iconSize = size === 'sm' ? 13 : 16

  return (
    <span className="inline-flex items-center gap-1" title={label}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < score
          ? <IconShieldCheck key={i} size={iconSize} style={{ color }} />
          : <IconShield      key={i} size={iconSize} style={{ color: '#D1D5DB' }} />
      )}
      {showLabel && (
        <span className="text-[11px] font-semibold ml-0.5" style={{ color }}>{label}</span>
      )}
    </span>
  )
}
