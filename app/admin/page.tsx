'use client'
import eventsData from '@/app/events/events.json'
import Breadcrumbs from '@/components/Breadcrumbs'
import DashboardCharts from '@/components/admin/DashboardCharts'
import LumaSyncButton from '@/components/admin/LumaSyncButton'
import ManageDropdown from '@/components/admin/ManageDropdown'
import {useAuthStore} from '@/firebase/AuthClient'
import {
  addAdminByEmail,
  approveAdminRequest,
  denyAdminRequest,
  fetchActiveAdmins,
  fetchAdminRequests,
  fetchPendingAdminInvites,
  removeAdminAccess,
  revokeAdminInvite,
} from '@/firebase/actions/auth.admin'
import {Event} from '@/firebase/types'
import {Button} from '@heroui/button'
import {Card, CardBody} from '@heroui/card'
import {Input} from '@heroui/input'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {addToast} from '@heroui/toast'
import {RotateCw, Trash2} from 'lucide-react'
import {useEffect, useState} from 'react'

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
    <Card className="border-default-100 w-full border shadow-sm" radius="lg">
      <CardBody className="gap-5 p-6">
        <div>
          <h3 className="text-foreground text-lg font-bold">Add New Administrator</h3>
          <p className="text-default-500 mt-1 text-sm leading-relaxed">
            Add an email address to the secure whitelist. They will be able to claim custom admin
            permissions from their My Profile page.
          </p>
        </div>
        <div className="mt-1 flex w-full gap-3">
          <Input
            placeholder="kochi@example.com"
            value={email}
            onValueChange={setEmail}
            size="md"
            type="email"
            variant="flat"
            classNames={{inputWrapper: 'bg-default-100 border-none shadow-none'}}
          />
          <Button
            color="primary"
            onPress={handleCreate}
            isLoading={isLoading}
            size="md"
            className="px-6 font-medium">
            Add
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

function AdminRequestsList({
  refreshTrigger,
  onListChanged,
}: {
  refreshTrigger: number
  onListChanged: () => void
}) {
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
          setRequests((prev) => prev.filter((r) => r.id !== requestId))
          onListChanged()
        } else {
          addToast({title: 'Error', description: res.message, color: 'danger'})
        }
      } else {
        if (!window.confirm(`Are you sure you want to deny the admin request for ${userEmail}?`))
          return
        const res = await denyAdminRequest(idToken, requestId)
        if (res.valid) {
          addToast({title: 'Denied', description: res.message, color: 'success'})
          setRequests((prev) => prev.filter((r) => r.id !== requestId))
        } else {
          addToast({title: 'Error', description: res.message, color: 'danger'})
        }
      }
    } catch (e) {
      addToast({title: 'Error', description: 'Failed to complete action', color: 'danger'})
    }
  }

  if (loadingReqs) return <p className="text-default-400 text-sm">Loading requests...</p>
  if (requests.length === 0)
    return <p className="text-default-400 text-sm">No pending admin requests.</p>

  return (
    <div className="flex w-full flex-col gap-4">
      {requests.map((req) => (
        <Card key={req.id} className="border-default-100 w-full border shadow-sm" radius="lg">
          <CardBody className="flex flex-row items-center justify-between p-5">
            <div className="flex flex-col gap-0.5">
              <p className="text-foreground font-bold">{req.name}</p>
              <p className="text-default-500 text-sm">{req.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                color="success"
                className="px-4 font-medium"
                onPress={() => handleAction(req.id, req.email, 'approve')}>
                Approve
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="flat"
                className="px-4 font-medium"
                onPress={() => handleAction(req.id, req.email, 'deny')}>
                Deny
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

function AdminInvitesList({
  refreshTrigger,
  onListChanged,
  isManageMode,
}: {
  refreshTrigger: number
  onListChanged: () => void
  isManageMode?: boolean
}) {
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
    if (!window.confirm('Are you sure you want to revoke this admin invite?')) return

    try {
      const idToken = await user.getIdToken()
      const res = await revokeAdminInvite(idToken, inviteId)
      if (res.valid) {
        addToast({title: 'Revoked', description: res.message, color: 'success'})
        setInvites((prev) => prev.filter((i) => i.id !== inviteId))
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
    <div className="flex w-full flex-col gap-4">
      {invites.map((invite) => (
        <Card key={invite.id} className="border-default-100 w-full border shadow-sm" radius="lg">
          <CardBody className="flex flex-row items-center justify-between p-5">
            <div className="flex flex-col gap-0.5">
              <p className="text-foreground font-bold">{invite.email}</p>
              <p className="text-default-400 text-xs">
                Sent: {invite.addedAt ? new Date(invite.addedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            {isManageMode && (
              <Button
                size="sm"
                color="danger"
                variant="flat"
                className="px-4 font-medium"
                onPress={() => handleRevoke(invite.id)}>
                Revoke
              </Button>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

function ActiveAdminsList({
  refreshTrigger,
  isManageMode,
}: {
  refreshTrigger: number
  isManageMode?: boolean
}) {
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
  if (admins.length === 0)
    return <p className="text-default-400 text-sm">No active admins found.</p>

  const handleRemove = async (targetEmail: string) => {
    if (!user) return
    if (!window.confirm(`Are you sure you want to remove admin access for ${targetEmail}?`)) return

    try {
      const idToken = await user.getIdToken()
      const res = await removeAdminAccess(idToken, targetEmail)
      if (res.valid) {
        addToast({title: 'Removed', description: res.message, color: 'success'})
        setAdmins((prev) => prev.filter((a) => a.email !== targetEmail))
      } else {
        addToast({title: 'Error', description: res.message, color: 'danger'})
      }
    } catch (e) {
      addToast({title: 'Error', description: 'Failed to complete action', color: 'danger'})
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {admins.map((admin) => {
        const isSuper = admin.email === 'vancouverkdd@gmail.com'
        return (
          <Card key={admin.id} className="border-default-100 w-full border shadow-sm" radius="lg">
            <CardBody className="flex flex-row items-center justify-between p-5">
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground font-bold">{admin.email}</p>
                <p className="text-default-400 text-xs">
                  Since {admin.addedAt ? new Date(admin.addedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${isSuper ? 'bg-primary/5 text-primary-600 border-primary/20' : 'bg-success/5 text-success-600 border-success/20'}`}>
                  {isSuper ? 'Super admin' : 'General Admin'}
                </div>
                {!isSuper && isManageMode && (
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="px-4 font-medium"
                    onPress={() => handleRemove(admin.email)}>
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start sm:gap-4">
            <h1 className="truncate text-xl font-bold sm:text-2xl">Admin Dashboard</h1>
            <div className="hidden sm:block">
              <LumaSyncButton events={events} />
            </div>
            <div className="block sm:hidden">
              <ManageDropdown />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="block sm:hidden">
              <LumaSyncButton events={events} />
            </div>
            <Button
              as={Link}
              color="primary"
              variant="flat"
              href="/admin/logs"
              className="flex-1 sm:flex-none">
              View User Logs
            </Button>
            <div className="hidden sm:block">
              <ManageDropdown />
            </div>
          </div>
        </div>

        <Spacer y={6} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm font-bold uppercase">Total Participants</p>
              <p className="text-primary text-4xl font-bold">
                {totalParticipants.toLocaleString()}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm font-bold uppercase">Total Events</p>
              <p className="text-secondary text-4xl font-bold">{totalEvents}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col items-center justify-center py-6">
              <p className="text-default-500 text-sm font-bold uppercase">Average Attendance</p>
              <p className="text-success text-4xl font-bold">{avgParticipants}</p>
            </CardBody>
          </Card>
        </div>

        <Spacer y={8} />

        {/* Analytics Charts */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Analytics Overview</h2>
          <DashboardCharts events={events} />
        </div>

        <Spacer y={8} />

        {/* Administrator Management - Restricted to SuperAdmins */}
        {superadmin && (
          <div className="border-default-200 mt-8 border-t pt-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-bold">
                Super Admin Controls{' '}
                <span className="rounded-full bg-[#ff1a75] px-3 py-1 text-xs font-semibold text-white">
                  Restricted
                </span>
              </h2>
              <Button
                size="md"
                variant="flat"
                className="bg-default-100 font-medium"
                onPress={() => setRefreshTrigger((t) => t + 1)}
                startContent={<RotateCw className="h-4 w-4" />}>
                Refresh Lists
              </Button>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              {/* Left Column */}
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <h3 className="text-default-700 text-lg font-bold">Pending Admin Requests</h3>
                  <AdminRequestsList
                    refreshTrigger={refreshTrigger}
                    onListChanged={() => setRefreshTrigger((t) => t + 1)}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-default-700 text-lg font-bold">Active Administrators</h3>
                    <Button
                      isIconOnly
                      size="sm"
                      variant={manageAdmins ? 'solid' : 'light'}
                      color={manageAdmins ? 'primary' : 'default'}
                      onPress={() => setManageAdmins(!manageAdmins)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <ActiveAdminsList refreshTrigger={refreshTrigger} isManageMode={manageAdmins} />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <h3 className="text-default-700 text-lg font-bold">Direct Email Invite</h3>
                  <AdminManager onInviteSent={() => setRefreshTrigger((t) => t + 1)} />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-default-700 text-lg font-bold">Pending Admin Invites</h3>
                    <Button
                      isIconOnly
                      size="sm"
                      variant={manageInvites ? 'solid' : 'light'}
                      color={manageInvites ? 'primary' : 'default'}
                      onPress={() => setManageInvites(!manageInvites)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <AdminInvitesList
                    refreshTrigger={refreshTrigger}
                    onListChanged={() => setRefreshTrigger((t) => t + 1)}
                    isManageMode={manageInvites}
                  />
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
