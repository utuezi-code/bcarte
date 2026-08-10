import { randomBytes } from 'crypto'

export function generateCertId(): string {
  const year = new Date().getFullYear()
  const rand = randomBytes(4).toString('hex').toUpperCase()
  return `BCT-${year}-${rand}`
}
