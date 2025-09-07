import {auth} from './app'

export async function verifyAdminToken(token: string) {
  const decodedToken = await auth.verifyIdToken(token, true)
  if (!decodedToken.admin) {
    return {valid: false, message: 'Unauthorized'}
  }
  return {valid: true, message: 'Authorized'}
}
