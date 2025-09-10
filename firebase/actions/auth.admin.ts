'use server'
import {auth} from '@/firebase/server'

export async function verifyAdminPassword(token: string, password: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (password === process.env.KDD_ADMIN_PASSWORD) {
      await auth.setCustomUserClaims(decodedToken.uid, {admin: true})
      return {valid: true, message: 'Admin verified'}
    }
    return {valid: false, message: 'Invalid password'}
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {valid: false, message: error.message}
    }
    return {valid: false, message: 'Unknown error'}
  }
}

export async function stepDownAsAdmin(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    await auth.setCustomUserClaims(decodedToken.uid, {admin: false})
    return {valid: true, message: 'Admin step down'}
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {valid: false, message: error.message}
    }
    return {valid: false, message: 'Unknown error'}
  }
}
