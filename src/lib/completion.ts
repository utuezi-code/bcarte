export type CheckItem = { label: string; done: boolean }

export function computeCompletion(data: {
  avatarUrl?: string | null
  fullName?: string | null
  title?: string | null
  bio?: string | null
  phone?: string | null
  linkedin?: string | null
  skills?: string[]
  experiences?: unknown[]
  educations?: unknown[]
}): { pct: number; items: CheckItem[] } {
  const items: CheckItem[] = [
    { label: 'Photo',       done: !!data.avatarUrl },
    { label: 'Nom',         done: !!data.fullName },
    { label: 'Titre',       done: !!data.title },
    { label: 'Bio',         done: !!data.bio },
    { label: 'Contact',     done: !!(data.phone || data.linkedin) },
    { label: 'Compétences', done: (data.skills?.length ?? 0) > 0 },
    { label: 'Expériences', done: (data.experiences?.length ?? 0) > 0 },
    { label: 'Formations',  done: (data.educations?.length ?? 0) > 0 },
  ]
  const pct = Math.round((items.filter(i => i.done).length / items.length) * 100)
  return { pct, items }
}
