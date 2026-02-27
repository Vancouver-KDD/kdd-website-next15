'use server'
import {auth, logUserActivity, firestore} from '@/firebase/server'
import {FieldValue} from 'firebase-admin/firestore'

export async function acceptAdminInvite(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    const userEmail = decodedToken.email

    if (!userEmail) {
       return {valid: false, message: 'No email found for this user'}
    }

    // Check if there is an invite for this user
    const snapshot = await firestore.collection('admin_invites')
      .where('email', '==', userEmail.toLowerCase().trim())
      .where('status', '==', 'pending')
      .get()

    if (snapshot.empty) {
      return {valid: false, message: 'No pending admin invites found.'}
    }

    const inviteDoc = snapshot.docs[0]

    // 1. Move to whitelist
    await firestore.collection('admin_whitelist').doc(userEmail).set({
      addedBy: inviteDoc.data().addedBy,
      addedAt: FieldValue.serverTimestamp(),
      email: userEmail
    })

    // 2. Mark invite as accepted
    await inviteDoc.ref.update({
      status: 'accepted',
      acceptedAt: FieldValue.serverTimestamp(),
      acceptedByUid: decodedToken.uid
    })

    // 3. Grant claims
    await auth.setCustomUserClaims(decodedToken.uid, {admin: true})
    
    await logUserActivity(decodedToken.uid, 'verify_admin_password', {
      userId: decodedToken.uid,
      email: userEmail,
      action: 'accepted_admin_invite',
      success: true,
    })

    return {valid: true, message: 'Successfully accepted Admin Invite!'}
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {valid: false, message: error.message}
    }
    return {valid: false, message: 'Unknown error'}
  }
}

export async function declineAdminInvite(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    const userEmail = decodedToken.email

    if (!userEmail) {
       return {valid: false, message: 'No email found for this user'}
    }

    const snapshot = await firestore.collection('admin_invites')
      .where('email', '==', userEmail.toLowerCase().trim())
      .where('status', '==', 'pending')
      .get()

    if (snapshot.empty) {
      return {valid: false, message: 'No pending admin invites found.'}
    }

    const inviteDoc = snapshot.docs[0]

    await inviteDoc.ref.update({
      status: 'declined',
      declinedAt: FieldValue.serverTimestamp(),
      declinedByUid: decodedToken.uid
    })

    await logUserActivity(decodedToken.uid, 'verify_admin_password', {
      action: 'declined_admin_invite',
      success: true,
    })

    return {valid: true, message: 'Admin invite declined.'}
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {valid: false, message: error.message}
    }
    return {valid: false, message: 'Unknown error'}
  }
}

export async function checkPendingInvite(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    const userEmail = decodedToken.email
    if (!userEmail) return { hasInvite: false }

    const snapshot = await firestore.collection('admin_invites')
      .where('email', '==', userEmail.toLowerCase().trim())
      .where('status', '==', 'pending')
      .get()

    return { hasInvite: !snapshot.empty }
  } catch (error) {
    return { hasInvite: false }
  }
}

export async function stepDownAsAdmin(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    const userEmail = decodedToken.email

    if (!userEmail) {
      return {valid: false, message: 'No email found'}
    }

    if (userEmail === 'vancouverkdd@gmail.com') {
      return {valid: false, message: 'Super admin cannot step down'}
    }

    // 1. Remove custom claims
    await auth.setCustomUserClaims(decodedToken.uid, {admin: false})

    // 2. Remove them from the active whitelist
    await firestore.collection('admin_whitelist').doc(userEmail.toLowerCase().trim()).delete()

    // 3. Log user activity
    await logUserActivity(decodedToken.uid, 'step_down_as_admin', {
      userId: decodedToken.uid,
      success: true,
    })

    return {valid: true, message: 'Admin access removed successfully'}
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {valid: false, message: error.message}
    }
    return {valid: false, message: 'Unknown error'}
  }
}

export async function addAdminByEmail(token: string, newAdminEmail: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (decodedToken.email !== 'vancouverkdd@gmail.com') {
      return {valid: false, message: 'Only Superadmins can add admins.'}
    }

    if (!newAdminEmail) return {valid: false, message: 'Invalid email'}
    
    // Create pending invite instead of direct whitelist
    await firestore.collection('admin_invites').add({
      addedBy: decodedToken.uid,
      addedAt: FieldValue.serverTimestamp(),
      email: newAdminEmail.toLowerCase().trim(),
      status: 'pending'
    })
    
    // (We no longer attempt proactive sync, they must accept it themselves)

    await logUserActivity(decodedToken.uid, 'verify_admin_password', {
      action: 'invited_admin',
      targetEmail: newAdminEmail,
      success: true
    })

    return {valid: true, message: `Successfully invited ${newAdminEmail} to become an admin.`}

  } catch (error: unknown) {
    if (error instanceof Error) {
      return {valid: false, message: error.message}
    }
    return {valid: false, message: 'Unknown error'}
  }
}

export async function requestAdminAccess(token: string, name: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    const userEmail = decodedToken.email
    if (!userEmail) return {valid: false, message: 'Email required'}

    await firestore.collection('admin_requests').doc(decodedToken.uid).set({
      uid: decodedToken.uid,
      email: userEmail,
      name,
      status: 'pending',
      requestedAt: FieldValue.serverTimestamp()
    })

    await logUserActivity(decodedToken.uid, 'verify_admin_password', {
      action: 'requested_admin_access',
      success: true
    })

    return {valid: true, message: 'Admin request sent successfully!'}
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {valid: false, message: error.message}
    }
    return {valid: false, message: 'Unknown error'}
  }
}

export async function fetchAdminRequests(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (decodedToken.email !== 'vancouverkdd@gmail.com') {
      return {success: false, requests: [], message: 'Unauthorized'}
    }

    const snapshot = await firestore.collection('admin_requests').where('status', '==', 'pending').get()
    
    // Hard-filter: If they are already an active admin, don't show their obsolete requests anymore
    const activeAdminsRes = await fetchActiveAdmins(token)
    const activeEmails = activeAdminsRes.success ? activeAdminsRes.admins.map(a => a.email) : []

    const requests = snapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          email: data.email || '',
          requestedAt: data?.requestedAt ? data.requestedAt.toMillis() : undefined
        }
      })
      .filter(req => !activeEmails.includes(req.email))

    return {success: true, requests}
  } catch (error) {
    return {success: false, requests: [], message: 'Failed to fetch requests'}
  }
}

export async function fetchActiveAdmins(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (decodedToken.email !== 'vancouverkdd@gmail.com') {
      return {success: false, admins: [], message: 'Unauthorized'}
    }

    // 1. Fetch exactly from the Whitelist DB. This effectively bypasses the Auth.listUsers() 
    // 1-hour cache propagation delay, ensuring users who stepped down vanish immediately.
    const snapshot = await firestore.collection('admin_whitelist').get()
    const whitelistDocs = snapshot.docs.map(doc => doc.data())
    
    // We can still try to grab listUsers just to fetch proper UIDs for React keys if needed, 
    // but we strictly FILTER based on the whitelist documents.
    const listUsersResult = await auth.listUsers(1000)

    const admins = whitelistDocs.map(data => {
      const u = listUsersResult.users.find(uu => uu.email === data.email)
      return {
        id: u ? u.uid : data.email,
        email: data.email,
        addedBy: data.addedBy || 'System',
        addedAt: data.addedAt ? data.addedAt.toMillis() : undefined
      }
    })

    // Auto-inject Super Admin if missing from the Whitelist DB.
    if (!admins.find(a => a.email === 'vancouverkdd@gmail.com')) {
      const vKdd = listUsersResult.users.find(u => u.email === 'vancouverkdd@gmail.com')
      admins.push({
        id: vKdd ? vKdd.uid : 'vancouverkdd@gmail.com',
        email: 'vancouverkdd@gmail.com',
        addedBy: 'System',
        addedAt: undefined
      })
    }

    return {success: true, admins}
  } catch (error) {
    return {success: false, admins: [], message: 'Failed to fetch active admins'}
  }
}

export async function approveAdminRequest(token: string, requestId: string, userEmail: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (decodedToken.email !== 'vancouverkdd@gmail.com') {
      return {valid: false, message: 'Unauthorized'}
    }

    // 1. Add to Whitelist
    await firestore.collection('admin_whitelist').doc(userEmail.toLowerCase().trim()).set({
      addedBy: decodedToken.uid,
      addedAt: FieldValue.serverTimestamp(),
      email: userEmail.toLowerCase().trim()
    })

    // 2. Delete the request explicitly instead of just marking it approved,
    // so it doesn't leave ghosting artifacts if the admin is later removed and re-added.
    await firestore.collection('admin_requests').doc(requestId).delete()

    // 3. Grant claims
    await auth.setCustomUserClaims(requestId, {admin: true})

    return {valid: true, message: `Approved access for ${userEmail}`}
  } catch (error) {
    return {valid: false, message: 'Failed to approve request'}
  }
}

export async function denyAdminRequest(token: string, requestId: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (decodedToken.email !== 'vancouverkdd@gmail.com') {
      return {valid: false, message: 'Unauthorized'}
    }

    await firestore.collection('admin_requests').doc(requestId).update({
      status: 'denied',
      resolvedAt: FieldValue.serverTimestamp(),
      resolvedBy: decodedToken.uid
    })

    return {valid: true, message: `Request denied`}
  } catch (error) {
    return {valid: false, message: 'Failed to deny request'}
  }
}

export async function removeAdminAccess(token: string, targetEmail: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (decodedToken.email !== 'vancouverkdd@gmail.com') {
      return {valid: false, message: 'Unauthorized'}
    }

    if (!targetEmail || targetEmail === 'vancouverkdd@gmail.com') {
      return {valid: false, message: 'Invalid or restricted target email'}
    }

    try {
      const targetUser = await auth.getUserByEmail(targetEmail)
      await auth.setCustomUserClaims(targetUser.uid, {admin: false})
    } catch (e) {
      // User might not exist in Auth, but we proceed to delete from DB
    }

    await firestore.collection('admin_whitelist').doc(targetEmail.toLowerCase().trim()).delete()

    return {valid: true, message: `Removed admin access for ${targetEmail}`}
  } catch (error) {
    return {valid: false, message: 'Failed to remove admin access'}
  }
}

export async function fetchPendingAdminInvites(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (decodedToken.email !== 'vancouverkdd@gmail.com') {
      return {success: false, invites: [], message: 'Unauthorized'}
    }

    const snapshot = await firestore.collection('admin_invites').where('status', '==', 'pending').get()
    
    const invites = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email || '',
        addedAt: data?.addedAt ? data.addedAt.toMillis() : undefined
      }
    })

    return {success: true, invites}
  } catch (error) {
    return {success: false, invites: [], message: 'Failed to fetch pending invites'}
  }
}

export async function revokeAdminInvite(token: string, inviteId: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    if (decodedToken.email !== 'vancouverkdd@gmail.com') {
      return {valid: false, message: 'Unauthorized'}
    }

    await firestore.collection('admin_invites').doc(inviteId).delete()

    return {valid: true, message: `Invite revoked`}
  } catch (error) {
    return {valid: false, message: 'Failed to revoke invite'}
  }
}
