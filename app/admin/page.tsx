'use client'
import {scrapeLumaEvent} from '@/app/actions/scrape-luma'
import eventsData from '@/app/events/events.json'
import {Event} from '@/firebase/types'
import Breadcrumbs from '@/components/Breadcrumbs'
import DashboardCharts from '@/components/admin/DashboardCharts'
import LumaSyncButton from '@/components/admin/LumaSyncButton'
import {Card, CardBody} from '@heroui/card'
import {Button} from '@heroui/button'
import {Input} from '@heroui/input'
import {addToast} from '@heroui/toast'
import ManageDropdown from '@/components/admin/ManageDropdown'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {useState, useEffect, useCallback} from 'react'
import {useAuthStore} from '@/firebase/AuthClient'
import {addAdminByEmail, fetchAdminRequests, fetchActiveAdmins, approveAdminRequest, denyAdminRequest, removeAdminAccess, fetchPendingAdminInvites, revokeAdminInvite} from '@/firebase/actions/auth.admin'
import {RotateCw, MoreVertical, Settings2, Trash2} from 'lucide-react'

function AdminManager({onInviteSent}: {onInviteSent: () => void}) {
  const {user} = useAuthStore()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if (!user || !email) return
    setIsLoading(true)
    try {
      const idToken = await user.getIdToken()
      const {valid, message} = await addAdminByEmail(idToken, email)
      if (valid) {
        addToast({title: 'Success', description: message, color: 'success'})
        setEmail('')
        onInviteSent()
      } else {
        addToast({title: 'Error', description: message, color: 'danger'})
      }
    } catch (e) {
      addToast({title: 'Error', description: 'Failed to add admin', color: 'danger'})
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-sm border border-default-100" radius="lg">
      <CardBody className="p-6 gap-5">
        <div>
          <h3 className="font-bold text-lg text-foreground">Add New Administrator</h3>
          <p className="text-sm text-default-500 mt-1 leading-relaxed">Add an email address to the secure whitelist. They will be able to claim custom admin permissions from their My Profile page.</p>
        </div>
        <div className="flex w-full gap-3 mt-1">
           <Input 
             placeholder="kochi@example.com"
             value={email}
             onValueChange={setEmail}
             size="md"
             type="email"
             variant="flat"
             classNames={{inputWrapper: "bg-default-100 border-none shadow-none"}}
           />
           <Button color="primary" onPress={handleCreate} isLoading={isLoading} size="md" className="font-medium px-6">Add</Button>
        </div>
      </CardBody>
    </Card>
  )
}

function AdminRequestsList({refreshTrigger, onListChanged}: {refreshTrigger: number, onListChanged: () => void}) {
  const {user} = useAuthStore()
  const [requests, setRequests] = useState<any[]>([])
  const [loadingReqs, setLoadingReqs] = useState(true)

  useEffect(() => {
    async function loadRequests() {
      if (!user) return
      try {
        const idToken = await user.getIdToken()
        const res = await fetchAdminRequests(idToken)
        if (res.success) {
          setRequests(res.requests || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingReqs(false)
      }
    }
    loadRequests()
  }, [user, refreshTrigger])

  const handleAction = async (requestId: string, userEmail: string, action: 'approve' | 'deny') => {
    if (!user) return
    try {
      const idToken = await user.getIdToken()
      if (action === 'approve') {
        const res = await approveAdminRequest(idToken, requestId, userEmail)
        if (res.valid) {
          addToast({title: 'Approved', description: res.message, color: 'success'})
          setRequests(prev => prev.filter(r => r.id !== requestId))
          onListChanged()
        } else {
          addToast({title: 'Error', description: res.message, color: 'danger'})
        }
      } else {
        if (!window.confirm(`Are you sure you want to deny the admin request for ${userEmail}?`)) return
        const res = await denyAdminRequest(idToken, requestId)
        if (res.valid) {
           addToast({title: 'Denied', description: res.message, color: 'success'})
           setRequests(prev => prev.filter(r => r.id !== requestId))
        } else {
           addToast({title: 'Error', description: res.message, color: 'danger'})
        }
      }
    } catch (e) {
      addToast({title: 'Error', description: 'Failed to complete action', color: 'danger'})
    }
  }

  if (loadingReqs) return <p className="text-default-400 text-sm">Loading requests...</p>
  if (requests.length === 0) return <p className="text-default-400 text-sm">No pending admin requests.</p>

  return (
    <div className="flex flex-col gap-4 w-full">
      {requests.map(req => (
        <Card key={req.id} className="w-full shadow-sm border border-default-100" radius="lg">
          <CardBody className="flex flex-row items-center justify-between p-5">
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-foreground">{req.name}</p>
              <p className="text-sm text-default-500">{req.email}</p>
            </div>
            <div className="flex items-center gap-2">
               <Button size="sm" color="success" className="font-medium px-4" onPress={() => handleAction(req.id, req.email, 'approve')}>Approve</Button>
               <Button size="sm" color="danger" variant="flat" className="font-medium px-4" onPress={() => handleAction(req.id, req.email, 'deny')}>Deny</Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

function AdminInvitesList({refreshTrigger, onListChanged, isManageMode}: {refreshTrigger: number, onListChanged: () => void, isManageMode?: boolean}) {
  const {user} = useAuthStore()
  const [invites, setInvites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInvites() {
      if (!user) return
      try {
        const idToken = await user.getIdToken()
        const res = await fetchPendingAdminInvites(idToken)
        if (res.success) {
          setInvites(res.invites || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadInvites()
  }, [user, refreshTrigger])

  const handleRevoke = async (inviteId: string) => {
    if (!user) return
    if (!window.confirm("Are you sure you want to revoke this admin invite?")) return
    
    try {
      const idToken = await user.getIdToken()
      const res = await revokeAdminInvite(idToken, inviteId)
      if (res.valid) {
        addToast({title: 'Revoked', description: res.message, color: 'success'})
        setInvites(prev => prev.filter(i => i.id !== inviteId))
        onListChanged()
      } else {
        addToast({title: 'Error', description: res.message, color: 'danger'})
      }
    } catch (e) {
      addToast({title: 'Error', description: 'Failed to revoke invite', color: 'danger'})
    }
  }

  if (loading) return <p className="text-default-400 text-sm">Loading pending invites...</p>
  if (invites.length === 0) return <p className="text-default-400 text-sm">No pending invites.</p>

  return (
    <div className="flex flex-col gap-4 w-full">
      {invites.map(invite => (
        <Card key={invite.id} className="w-full shadow-sm border border-default-100" radius="lg">
          <CardBody className="flex flex-row items-center justify-between p-5">
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-foreground">{invite.email}</p>
              <p className="text-xs text-default-400">Sent: {invite.addedAt ? new Date(invite.addedAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
            {isManageMode && (
              <Button size="sm" color="danger" variant="flat" className="font-medium px-4" onPress={() => handleRevoke(invite.id)}>
                Revoke
              </Button>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

function ActiveAdminsList({refreshTrigger, isManageMode}: {refreshTrigger: number, isManageMode?: boolean}) {
  const {user} = useAuthStore()
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAdmins() {
      if (!user) return
      try {
        const idToken = await user.getIdToken()
        const res = await fetchActiveAdmins(idToken)
        if (res.success) {
          setAdmins(res.admins || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadAdmins()
  }, [user, refreshTrigger])

  if (loading) return <p className="text-default-400 text-sm">Loading active admins...</p>
  if (admins.length === 0) return <p className="text-default-400 text-sm">No active admins found.</p>

  const handleRemove = async (targetEmail: string) => {
    if (!user) return
    if (!window.confirm(`Are you sure you want to remove admin access for ${targetEmail}?`)) return
    
    try {
      const idToken = await user.getIdToken()
      const res = await removeAdminAccess(idToken, targetEmail)
      if (res.valid) {
        addToast({title: 'Removed', description: res.message, color: 'success'})
        setAdmins(prev => prev.filter(a => a.email !== targetEmail))
      } else {
        addToast({title: 'Error', description: res.message, color: 'danger'})
      }
    } catch (e) {
      addToast({title: 'Error', description: 'Failed to complete action', color: 'danger'})
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {admins.map(admin => {
        const isSuper = admin.email === 'vancouverkdd@gmail.com'
        return (
          <Card key={admin.id} className="w-full shadow-sm border border-default-100" radius="lg">
            <CardBody className="flex flex-row items-center justify-between p-5">
              <div className="flex flex-col gap-0.5">
                <p className="font-bold text-foreground">{admin.email}</p>
                <p className="text-xs text-default-400">Since {admin.addedAt ? new Date(admin.addedAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`text-[11px] px-2.5 py-1 uppercase tracking-wider rounded-full font-bold border ${isSuper ? 'bg-primary/5 text-primary-600 border-primary/20' : 'bg-success/5 text-success-600 border-success/20'}`}>
                  {isSuper ? 'Super admin' : 'General Admin'}
                </div>
                {(!isSuper && isManageMode) && (
                  <Button size="sm" color="danger" variant="flat" className="font-medium px-4" onPress={() => handleRemove(admin.email)}>
                    Remove
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}

export default function AdminPage() {
  const events = eventsData as unknown as Event[]
  const {superadmin} = useAuthStore()
  
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [manageAdmins, setManageAdmins] = useState(false)
  const [manageInvites, setManageInvites] = useState(false)

  // Calculate summary stats
  const totalEvents = events.length
  const totalParticipants = events.reduce((sum, e) => sum + (e.quantity || 0), 0)
  const avgParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0

  return (
    <>
      <Breadcrumbs paths={[{href: '/', title: 'Home'}, {title: 'Admin Dashboard'}]} />
      <Spacer y={4} />
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <LumaSyncButton events={events} />
          </div>
          <div className="flex gap-4">
             <Button as={Link} color="primary" variant="flat" href="/admin/logs">
              View User Logs
            </Button>
            
            <ManageDropdown />
          </div>
        </div>
        
        <Spacer y={6} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm uppercase font-bold">Total Participants</p>
              <p className="text-4xl font-bold text-primary">{totalParticipants.toLocaleString()}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm uppercase font-bold">Total Events</p>
              <p className="text-4xl font-bold text-secondary">{totalEvents}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm uppercase font-bold">Average Attendance</p>
              <p className="text-4xl font-bold text-success">{avgParticipants}</p>
            </CardBody>
          </Card>
        </div>

        <Spacer y={8} />

        {/* Analytics Charts */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
          <DashboardCharts events={events} />
        </div>

        <Spacer y={8} />

        {/* Administrator Management - Restricted to SuperAdmins */}
        {superadmin && (
          <div className="mt-8 border-t border-default-200 pt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                 Super Admin Controls <span className="text-xs font-semibold bg-[#ff1a75] text-white px-3 py-1 rounded-full">Restricted</span>
              </h2>
              <Button size="md" variant="flat" className="bg-default-100 font-medium" onPress={() => setRefreshTrigger(t => t + 1)} startContent={<RotateCw className="w-4 h-4" />}>
                Refresh Lists
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
               {/* Left Column */}
               <div className="flex flex-col gap-10">
                 <div className="flex flex-col gap-4">
                   <h3 className="text-lg font-bold text-default-700">Pending Admin Requests</h3>
                   <AdminRequestsList refreshTrigger={refreshTrigger} onListChanged={() => setRefreshTrigger(t => t + 1)} />
                 </div>
                 
                 <div className="flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-bold text-default-700">
                       Active Administrators
                     </h3>
                     <Button isIconOnly size="sm" variant={manageAdmins ? 'solid' : 'light'} color={manageAdmins ? 'primary' : 'default'} onPress={() => setManageAdmins(!manageAdmins)}>
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   <ActiveAdminsList refreshTrigger={refreshTrigger} isManageMode={manageAdmins} />
                 </div>
               </div>

               {/* Right Column */}
               <div className="flex flex-col gap-10">
                 <div className="flex flex-col gap-4">
                   <h3 className="text-lg font-bold text-default-700">Direct Email Invite</h3>
                   <AdminManager onInviteSent={() => setRefreshTrigger(t => t + 1)} />
                 </div>

                 <div className="flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-bold text-default-700">
                       Pending Admin Invites
                     </h3>
                     <Button isIconOnly size="sm" variant={manageInvites ? 'solid' : 'light'} color={manageInvites ? 'primary' : 'default'} onPress={() => setManageInvites(!manageInvites)}>
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   <AdminInvitesList refreshTrigger={refreshTrigger} onListChanged={() => setRefreshTrigger(t => t + 1)} isManageMode={manageInvites} />
                 </div>
               </div>
            </div>

            <Spacer y={12} />
          </div>
        )}

      </div>
    </>
  )
}
