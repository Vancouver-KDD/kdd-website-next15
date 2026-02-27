'use client'
import {useAuthStore} from '@/firebase/AuthClient'
import {stepDownAsAdmin, requestAdminAccess, acceptAdminInvite, checkPendingInvite, declineAdminInvite} from '@/firebase/actions/auth.admin'
import {uploadProfileImage, updateUserMetadata, getUserActivity, fetchUserProfile} from '@/firebase/actions/profile'
import {Comment} from '@/firebase/types'
import {Button} from '@heroui/button'
import {Input} from '@heroui/input'
import {Tabs, Tab} from '@heroui/tabs'
import {addToast} from '@heroui/toast'
import {Camera, Activity, Settings} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState, useRef} from 'react'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import Link from 'next/link'

export default function ProfilePage() {
  const {user, loading, admin} = useAuthStore()
  const router = useRouter()
  const {t, locale} = useTranslation({...en, ...ko})

  const [displayName, setDisplayName] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [occupation, setOccupation] = useState('')
  const [file, setFile] = useState<File | null>(null)
  
  // Track initial state to check if modified
  const [initialData, setInitialData] = useState({ displayName: '', photoURL: '', occupation: '' })
  
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [hasRequestedAdmin, setHasRequestedAdmin] = useState(false)
  const [hasPendingInvite, setHasPendingInvite] = useState(false)

  const [myComments, setMyComments] = useState<Comment[]>([])
  const [reactedComments, setReactedComments] = useState<Comment[]>([])
  const [isFetchingActivity, setIsFetchingActivity] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
    if (user) {
      const initValues = async () => {
        setDisplayName(user.displayName || '')
        setPhotoURL(user.photoURL || '')
        
        const profileFetch = await fetchUserProfile(user.uid)
        const fetchedOcc = profileFetch.profile?.occupation || ''
        setOccupation(fetchedOcc)

        setInitialData({
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          occupation: fetchedOcc
        })
        
        // Force token refresh here so that if a Super Admin recently approved them,
        // the AuthClient Zustand store instantly picks up the new `admin: true` claim
        // from the `onIdTokenChanged` listener without requiring a hard logout.
        const token = await user.getIdToken(true) 
        const inviteCheck = await checkPendingInvite(token)
        setHasPendingInvite(inviteCheck.hasInvite)
      }
      initValues()
      fetchActivity(user.uid)
    }
  }, [user, loading, router])

  const hasChanges = file !== null || displayName.trim() !== (initialData.displayName || '').trim() || occupation.trim() !== (initialData.occupation || '').trim() || (photoURL === '' && initialData.photoURL !== '')

  const fetchActivity = async (uid: string) => {
    setIsFetchingActivity(true)
    const result = await getUserActivity(uid)
    if (result.success) {
      setMyComments(result.myComments || [])
      setReactedComments(result.reactedComments || [])
    }
    setIsFetchingActivity(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      // Local preview
      setPhotoURL(URL.createObjectURL(selectedFile))
    }
  }

  const handleCancel = () => {
    setDisplayName(initialData.displayName)
    setPhotoURL(initialData.photoURL)
    setOccupation(initialData.occupation)
    setFile(null)
  }

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)

    let updatedPhotoURL = user.photoURL || ''

    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadResult = await uploadProfileImage(user.uid, formData)
        
        if (!uploadResult.success || !uploadResult.url) {
          throw new Error('Image upload failed')
        }
        updatedPhotoURL = uploadResult.url
      }

      const updateResult = await updateUserMetadata(user.uid, displayName, file === null && photoURL === '' ? '' : updatedPhotoURL, occupation)
      
      if (!updateResult.success) {
        throw new Error('Profile update failed')
      }

      // Force UI refresh on Auth client
      await user.getIdToken(true) // Refresh token to trigger potential claim updates and reload user

      // The problem with standard Firebase Auth changes on client is `user.reload()` doesn't inherently trigger React context updates unless we force it or rely on `onAuthStateChanged`. 
      // Refreshing the page is the cleanest way to guarantee all synced comment instances and User top-nav instantly match.
      addToast({title: 'Success', description: t('profile.update_success'), color: 'success'})
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (error) {
      addToast({title: 'Error', description: String(error), color: 'danger'})
      setIsSaving(false)
    }
  }

  const CommentCard = ({comment}: {comment: Comment}) => {
    const linkPreview = comment.targetId.includes('study') ? `/study/${comment.targetId}` : `/events/${comment.targetId}`
    return (
      <Link href={linkPreview as any} className="block border border-default-200 p-4 rounded-xl hover:bg-default-50 transition-colors">
        <div className="flex items-center gap-3 mb-2">
           {comment.userPhotoURL ? (
             <img src={comment.userPhotoURL} alt={comment.userDisplayName} className="w-6 h-6 rounded-full object-cover" />
           ) : (
             <div className="w-6 h-6 rounded-full bg-default-200 flex items-center justify-center text-default-500 font-medium text-xs">
               {comment.userDisplayName.charAt(0).toUpperCase()}
             </div>
           )}
           <span className="font-semibold text-sm">{comment.userDisplayName}</span>
           <span className="text-xs text-default-400">
             {new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
               dateStyle: 'medium',
               timeStyle: 'short'
             }).format(new Date(comment.createdAt))}
           </span>
        </div>
        <p className="text-sm text-default-700 whitespace-pre-wrap">{comment.text}</p>
        
        {comment.reactions && Object.keys(comment.reactions).length > 0 && (
          <div className="flex gap-2 mt-3">
            {Object.entries(comment.reactions).map(([emoji, users]) => (
               <span key={emoji} className="text-xs bg-default-100 px-2 py-1 rounded-full">
                 {emoji} {users.length}
               </span>
            ))}
          </div>
        )}
      </Link>
    )
  }

  if (loading || !user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('profile.my_profile')}</h1>

      <Tabs aria-label="Profile Options" color="primary" variant="underlined" classNames={{
        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
        cursor: "w-full bg-primary",
        tab: "max-w-fit px-0 h-12",
        tabContent: "group-data-[selected=true]:text-primary"
      }}>
        
        <Tab
          key="settings"
          title={
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>{t('profile.settings')}</span>
            </div>
          }
        >
          <div className="pt-8 max-w-xl">
            <h2 className="text-xl font-semibold mb-6 text-primary">{t('profile.profile_section')}</h2>
            <div className="flex flex-col gap-6">
              
              {/* Avatar Uploader */}
              <div className="flex items-center gap-5">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-default-200" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-default-200 flex items-center justify-center text-default-500 text-3xl font-medium border-2 border-default-200">
                      {displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{t('profile.upload_avatar')}</h3>
                  <p className="text-sm text-default-500 mb-3">JPG, PNG up to 5MB</p>
                  <Button size="sm" variant="flat" onPress={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/png, image/jpeg" 
                    onChange={handleFileChange} 
                  />
                  {photoURL && (
                    <Button size="sm" color="danger" variant="flat" className="mt-2 ml-2" onPress={() => {
                      setPhotoURL('')
                      setFile(null)
                    }}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="h-px w-full bg-default-200 my-2" />
              
              {/* Profile Details */}
              <div className="flex flex-col gap-4">
                <Input
                  label={t('profile.change_name')}
                  placeholder="Enter your display name"
                  value={displayName}
                  onValueChange={setDisplayName}
                  variant="bordered"
                  className="max-w-sm"
                />
                
                <Input
                  label={t('profile.occupation')}
                  placeholder="Software Engineer at Google"
                  value={occupation}
                  onValueChange={setOccupation}
                  variant="bordered"
                  className="max-w-sm"
                />
              </div>
              
              <div className="pt-4 flex items-center gap-3">
                <Button color="primary" isLoading={isSaving} isDisabled={!hasChanges} onPress={handleSave}>
                  {t('profile.save_changes')}
                </Button>
                {hasChanges && (
                   <Button variant="flat" onPress={handleCancel}>
                     {t('profile.cancel')}
                   </Button>
                )}
              </div>

              <div className="h-px w-full bg-default-200 mt-8 mb-4" />
              
              {/* Admin Access block */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-primary">{t('profile.admin_section')}</h2>
                {admin ? (
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-sm text-default-500 mb-2">{t('profile.admin_verified')}</p>
                    <Button
                      color="danger"
                      variant="ghost"
                      size="sm"
                      onPress={async () => {
                        const idToken = await user.getIdToken()
                        const {valid, message} = await stepDownAsAdmin(idToken)
                        if (valid) {
                          await user.getIdToken(true)
                          addToast({title: 'Success', description: message, color: 'success'})
                        } else {
                          addToast({title: 'Error', description: message, color: 'danger'})
                        }
                      }}>
                      Remove admin access
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-3">
                    {hasPendingInvite ? (
                      <>
                        <p className="text-sm text-default-500">운영진 권한 초대가 도착했습니다. 받으시겠어요?</p>
                        <div className="flex gap-2">
                          <Button
                            color="primary"
                            onPress={async () => {
                              const idToken = await user.getIdToken()
                              if (!idToken) return
                              
                              const {valid, message} = await acceptAdminInvite(idToken)
                              if (valid) {
                                await user.getIdToken(true)
                                addToast({title: 'Verified', description: message, color: 'success'})
                                setHasPendingInvite(false)
                              } else {
                                addToast({title: 'Error', description: message, color: 'danger'})
                              }
                            }}
                          >
                            {t('profile.accept_invite')}
                          </Button>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={async () => {
                              const idToken = await user.getIdToken()
                              if (!idToken) return
                              
                              const {valid, message} = await declineAdminInvite(idToken)
                              if (valid) {
                                addToast({title: 'Declined', description: message, color: 'success'})
                                setHasPendingInvite(false)
                              } else {
                                addToast({title: 'Error', description: message, color: 'danger'})
                              }
                            }}
                          >
                            거절 (Decline)
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-default-500">Not an admin yet but interested in helping out? Drop a request straight to the Superadmins!</p>
                        <Button
                          color="secondary"
                          variant="flat"
                          isDisabled={hasRequestedAdmin}
                          onPress={async () => {
                            const idToken = await user.getIdToken()
                            if (!idToken) return
                            
                            const {valid, message} = await requestAdminAccess(idToken, displayName || user.displayName || 'Unknown User')
                            if (valid) {
                              setHasRequestedAdmin(true)
                              addToast({title: 'Request Sent!', description: message, color: 'success'})
                            } else {
                              addToast({title: 'Error', description: message, color: 'danger'})
                            }
                          }}
                        >
                          {hasRequestedAdmin ? t('profile.admin_pending') : t('profile.request_admin')}
                        </Button>
                      </>
                    )}
                  </div>
                )}
                

              </div>

            </div>
          </div>
        </Tab>

        <Tab
          key="activity"
          title={
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>{t('profile.activity')}</span>
            </div>
          }
        >
          <div className="pt-8">
             {isFetchingActivity ? (
               <div className="text-center py-10 text-default-400">Loading activity...</div>
             ) : (
               <div className="grid md:grid-cols-2 gap-8">
                 
                 {/* Authored Comments */}
                 <div>
                   <h3 className="text-xl font-semibold mb-4">{t('profile.my_comments')} <span className="text-default-400 text-sm ml-2">({myComments.length})</span></h3>
                   <div className="space-y-4">
                     {myComments.length === 0 ? (
                       <p className="text-default-400 italic">No comments written yet.</p>
                     ) : (
                       myComments.map(c => <CommentCard key={c.id} comment={c} />)
                     )}
                   </div>
                 </div>

                 {/* Reacted Comments */}
                 <div>
                   <h3 className="text-xl font-semibold mb-4 text-default-600">{t('profile.liked_comments')} <span className="text-default-400 text-sm ml-2">({reactedComments.length})</span></h3>
                   <div className="space-y-4 opacity-90">
                     {reactedComments.length === 0 ? (
                       <p className="text-default-400 italic">No reactions yet.</p>
                     ) : (
                       reactedComments.map(c => <CommentCard key={`reaction-${c.id}`} comment={c} />)
                     )}
                   </div>
                 </div>

               </div>
             )}
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}
