import { headers as getHeaders } from 'next/headers.js'
import config from '@payload-config'
import { getPayload } from 'payload'

export const getUser = async () => {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  try {
    const { user } = await payload.auth({ headers })
    return { user, payload }
  } catch (e) {
    console.error('Error getting user', e)
    return { user: null, payload: null }
  }
}

export const isUserAuthenticated = async () => {
  const { user } = await getUser()
  return !!user;
}
