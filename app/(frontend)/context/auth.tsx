// hooks/useAuth.ts
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthModal } from '@/app/(frontend)/context/auth-modal-context'

export function useAuth({ redirectOnFail = false }: { redirectOnFail?: boolean } = {}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showAuthModal } = useAuthModal()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })

        if (!res.ok) {
          if (redirectOnFail && window.location.pathname !== '/auth') {
            router.replace('/auth')
          }
          setUser(null)
          return
        }

        const { user } = await res.json()
        setUser(user)
      } catch (err) {
        setError('Unable to fetch user')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser().then(r => {});
  }, [redirectOnFail, router])

  const isUserAuthenticated = !!user

  return { user, isUserAuthenticated, loading, error, showAuthModal }
}
