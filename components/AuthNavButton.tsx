import {stepDownAsAdmin, verifyAdminPassword} from '@/firebase/actions/auth.admin'
import {useAuthStore} from '@/firebase/AuthClient'
import {Button} from '@heroui/button'
import {Input} from '@heroui/input'
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover'
import {addToast} from '@heroui/toast'
import {LogOut, Plus, User, UserCheck, UserStar} from 'lucide-react'
import Link from 'next/link'

export default function AuthNavButton() {
  const {user, admin} = useAuthStore()
  const UserIcon = user ? (admin ? UserStar : UserCheck) : User
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <UserIcon className="text-default-500 cursor-pointer transition-opacity hover:opacity-80" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2">
          <AuthContent />
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AuthContent() {
  const {user, loading, signInWithGoogle, logout, admin} = useAuthStore()

  if (loading) {
    return (
      <Button isLoading color="primary" variant="ghost">
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{user.displayName || user.email}</span>
          <Button
            color="danger"
            variant="ghost"
            size="sm"
            onPress={logout}
            startContent={<LogOut className="h-4 w-4" />}>
            Logout
          </Button>
        </div>
        {admin ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Thank you for your service</p>
            <Link href="/admin/events">
              <Button
                color="primary"
                variant="solid"
                size="sm"
                startContent={<Plus className="h-4 w-4" />}>
                Manage Events
              </Button>
            </Link>
            <Button
              color="danger"
              variant="ghost"
              size="sm"
              onPress={async () => {
                const idToken = await user.getIdToken()
                const {valid, message} = await stepDownAsAdmin(idToken)
                if (valid) {
                  await user.getIdToken(true)
                  addToast({
                    title: 'Step Down as Admin Success',
                    description: message,
                    color: 'success',
                  })
                } else {
                  addToast({
                    title: 'Step Down as Admin Failed',
                    description: message,
                    color: 'danger',
                  })
                }
              }}>
              Step Down as Admin
            </Button>
          </div>
        ) : (
          <form
            action={async (formData) => {
              const password = formData.get('password') as string
              const idToken = await user.getIdToken()
              if (!password || !idToken) {
                return
              }
              const {valid, message} = await verifyAdminPassword(idToken, password)
              if (valid) {
                await user.getIdToken(true)
                addToast({
                  title: 'Verify Admin Success',
                  description: message,
                  color: 'success',
                })
              } else {
                addToast({
                  title: 'Verify Admin Failed',
                  description: message,
                  color: 'danger',
                })
              }
            }}
            className="flex flex-col gap-2">
            <Input isRequired label="Admin Password" name="password" type="password" />
            <Button type="submit" color="primary" variant="solid">
              Verify
            </Button>
          </form>
        )}
      </div>
    )
  }

  return (
    <Button
      color="primary"
      variant="solid"
      onPress={signInWithGoogle}
      startContent={
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      }>
      Sign in with Google
    </Button>
  )
}
