'use client'

import Breadcrumbs from '@/components/Breadcrumbs'
import {getStudies} from '@/firebase/actions/study.admin'
import {useAuthStore} from '@/firebase/AuthClient'
import type {Event} from '@/firebase/types'
import {deleteStudy} from '@/firebase/actions/study.admin'
import {cn, formatISODate, getErrorMessage} from '@/lib/utils'
import {Button} from '@heroui/button'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Chip} from '@heroui/chip'
import {Image} from '@heroui/image'
import {Link} from '@heroui/link'
import {Tabs, Tab} from '@heroui/tabs'
import {Spacer} from '@heroui/spacer'
import {addToast} from '@heroui/toast'
import {Calendar, Edit, MapPin, Plus, Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import posthog from 'posthog-js'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'

export default function AdminStudiesPage() {
  const {user, admin, loading: authLoading} = useAuthStore()
  const router = useRouter()
  const [studies, setStudies] = useState<(Event & {id: string})[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingStudyId, setDeletingStudyId] = useState<string | null>(null)

  useEffect(() => {
    loadStudies()
  }, [admin])

  const loadStudies = async () => {
    setLoading(true)
    try {
      const token = await user?.getIdToken()
      if (!token) return
      const {success, studies, message} = await getStudies(token)
      if (!success) {
        posthog.capture('error', {
          error: 'Failed to load studies',
          message: message,
        })
        addToast({
          title: 'Error',
          description: message,
          color: 'danger',
        })
      } else {
        setStudies(studies || [])
      }
    } catch (error) {
      posthog.capture('error', {
        error: 'Failed to load studies',
        message: getErrorMessage(error, 'Failed to load studies'),
      })
      addToast({
        title: 'Error',
        description: getErrorMessage(error, 'Failed to load studies'),
        color: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (studyId: string, title?: string) => {
    if (!confirm(`Are you sure you want to delete "${title || 'this study'}"?`)) return

    setDeletingStudyId(studyId)
    try {
        const token = await user?.getIdToken()
        if (!token) return
        const res = await deleteStudy(token, studyId)
        if (res.success) {
            addToast({title: 'Success', description: 'Study deleted', color: 'success'})
            setStudies((prev) => prev.filter((s) => s.id !== studyId))
        } else {
            addToast({title: 'Error', description: res.message, color: 'danger'})
        }
    } catch (error) {
        addToast({title: 'Error', description: 'Failed to delete study', color: 'danger'})
    } finally {
        setDeletingStudyId(null)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="mt-4">Checking admin status...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="mt-4">Loading studies...</p>
        </div>
      </div>
    )
  }

  const postedStudies = studies.filter((s) => {
       if (s.status) return s.status === 'published'
       return !s.draft
  })
  
  const hiddenStudies = studies.filter((s) => {
       if (s.status) return s.status === 'hidden'
       return s.draft
  })

  const draftStudies = studies.filter((s) => s.status === 'draft')

  return (
    <>
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/admin', title: 'Admin Dashboard'},
          {title: 'Studies'},
        ]}
      />
      <Spacer y={4} />

      <div className="container mx-auto flex max-w-5xl flex-col px-6">
        <Link className="self-end" href={`/admin/studies/${crypto.randomUUID()}/create`}>
          <Button color="primary" startContent={<Plus className="h-4 w-4" />}>
            Create Study
          </Button>
        </Link>
        <Spacer y={4} />

        <Tabs aria-label="Study Status">
            <Tab key="draft" title={<div className="flex items-center gap-2"><span>📝</span> Draft <Chip size="sm" variant="flat">{draftStudies.length}</Chip></div>}>
                 <StudyList 
                    studies={draftStudies} 
                    router={router} 
                    handleDelete={handleDelete} 
                    deletingStudyId={deletingStudyId}
                    emptyMessage="No draft studies." 
                />
            </Tab>
            <Tab key="posted" title={<div className="flex items-center gap-2"><span>🚀</span> Posted <Chip size="sm" variant="flat">{postedStudies.length}</Chip></div>}>
                <StudyList 
                    studies={postedStudies} 
                    router={router} 
                    handleDelete={handleDelete} 
                    deletingStudyId={deletingStudyId}
                    emptyMessage="No posted studies." 
                />
            </Tab>
            <Tab key="hidden" title={<div className="flex items-center gap-2"><span>🔒</span> Hidden <Chip size="sm" variant="flat">{hiddenStudies.length}</Chip></div>}>
                <StudyList 
                    studies={hiddenStudies} 
                    router={router} 
                    handleDelete={handleDelete} 
                    deletingStudyId={deletingStudyId}
                    emptyMessage="No hidden studies." 
                />
            </Tab>
        </Tabs>
      </div>
    </>
  )
}

function StudyList({studies, router, handleDelete, deletingStudyId, emptyMessage}: {
    studies: (Event & {id: string})[], 
    router: any, 
    handleDelete: any, 
    deletingStudyId: string | null,
    emptyMessage: string
}) {
    const {t} = useTranslation({...en, ...ko})
    if (studies.length === 0) {
        return (
            <div className="py-6 text-center border-dashed border-2 rounded-xl flex flex-col items-center justify-center text-default-400">
                <p>{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
          {studies.map((study) => (
            <Card key={study.id} className={cn('w-full', study.draft && 'opacity-60')}>
              <CardHeader className="flex items-start justify-between">
                <div className="bg-default-50 mr-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border">
                  {study.image ? (
                    <Image 
                        src={study.image} 
                        alt="Poster" 
                        className="h-full w-full object-cover" 
                        radius="none"
                        removeWrapper
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{study.title}</h3>
                  <div className="text-default-500 mt-2 flex items-start gap-4 text-sm">
                    <div className="flex items-start gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      {formatISODate(study.date, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {study.location && (
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        {study.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {study.draft && (
                    <Chip size="sm" variant="flat" color="warning">
                      {t('chips.hidden')}
                    </Chip>
                  )}
                  {(() => {
                    const now = new Date()
                    const startDate = new Date(study.date)
                    const endDate = study.endDate ? new Date(study.endDate) : null
                    const isNaturallyOngoing = startDate < now && endDate && endDate >= now
                    
                    if (study.isOngoing || isNaturallyOngoing) {
                      return <Chip size="sm" classNames={{base: "bg-emerald-600", content: "text-white font-medium"}}>{t('chips.ongoing')}</Chip>
                    }
                    if (startDate > now) {
                      return <Chip size="sm" classNames={{base: "bg-amber-600", content: "text-white font-medium"}}>{t('chips.upcoming')}</Chip>
                    }
                    return <Chip color="default" size="sm">{t('chips.past')}</Chip>
                  })()}
                </div>
              </CardHeader>
              <CardBody>
                {study.description && (
                  <p className="text-default-600 mb-4 line-clamp-3 text-sm">{study.description}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Edit className="h-4 w-4" />}
                    onPress={() => router.push(`/admin/studies/${study.id}/edit`)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    startContent={<Trash2 className="h-4 w-4" />}
                    onPress={() => handleDelete(study.id, study.title)}
                    isLoading={deletingStudyId === study.id}>
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => router.push(`/study/${study.id}`)}>
                    View
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
    )
}
