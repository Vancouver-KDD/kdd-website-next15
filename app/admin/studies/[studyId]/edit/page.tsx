'use client'

import {StudyForm} from '@/app/admin/studies/StudyForm'
import Breadcrumbs from '@/components/Breadcrumbs'
import {getStudy} from '@/firebase/actions/study.admin'
import {useAuthStore} from '@/firebase/AuthClient'
import {Event} from '@/firebase/types'
import {Spacer} from '@heroui/spacer'
import {useParams} from 'next/navigation'
import {useEffect, useState} from 'react'

export default function EditStudyPage() {
  const params = useParams()
  const studyId = params.studyId as string
  const {user, admin, loading: authLoading} = useAuthStore()
  const [study, setStudy] = useState<(Event & {id: string}) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && studyId) {
      loadStudy()
    }
  }, [user, studyId])

  const loadStudy = async () => {
    try {
      const token = await user?.getIdToken()
      if (!token) return
      const res = await getStudy(token, studyId)
      if (res.success && res.study) {
        setStudy(res.study)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) return <div>Loading...</div>
  if (!admin) return <div>Unauthorized</div>
  if (!study) return <div>Study not found</div>

  return (
    <>
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/admin', title: 'Admin'},
          {href: '/admin/studies', title: 'Studies'},
          {title: 'Edit'},
        ]}
      />
      <Spacer y={4} />
      <div className="container mx-auto max-w-3xl px-6">
        <h1 className="mb-6 text-2xl font-bold">Edit Study</h1>
        <StudyForm study={study} />
      </div>
    </>
  )
}
