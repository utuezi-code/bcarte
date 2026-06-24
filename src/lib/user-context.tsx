'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'professionnel' | 'organisation'

interface UserContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
}

const UserContext = createContext<UserContextValue>({
  role: 'professionnel',
  setRole: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('professionnel')

  useEffect(() => {
    const saved = localStorage.getItem('bcarte_role') as UserRole | null
    if (saved === 'professionnel' || saved === 'organisation') {
      setRoleState(saved)
    }
  }, [])

  const setRole = (r: UserRole) => {
    setRoleState(r)
    localStorage.setItem('bcarte_role', r)
  }

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
