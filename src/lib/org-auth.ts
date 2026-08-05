import { supabaseAdmin } from './supabase-server'

export interface OrgAccess {
  orgId: string
  isOwner: boolean
}

/**
 * Resolves the organisation for the current user.
 * Accepts both the org owner AND any team member of the org.
 */
export async function getOrgAccess(userId: string): Promise<OrgAccess | null> {
  // 1. Check if owner
  const { data: owned } = await supabaseAdmin
    .from('organisations')
    .select('id')
    .eq('ownerId', userId)
    .single()

  if (owned) return { orgId: owned.id, isOwner: true }

  // 2. Check if team member
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', userId)
    .single()

  if (!profile) return null

  const { data: membership } = await supabaseAdmin
    .from('team_members')
    .select('organisationId')
    .eq('profileId', profile.id)
    .limit(1)
    .single()

  if (!membership) return null

  return { orgId: membership.organisationId, isOwner: false }
}
