import { supabase } from './supabase'

export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      return null
    }

    return { ...session.user, ...profile }
  } catch(e) {
    console.error('getCurrentUser error:', e)
    return null
  }
}

export async function signOut() {
  await supabase.auth.signOut()
}