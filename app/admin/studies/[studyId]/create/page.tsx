'use client'

import {StudyForm} from '@/app/admin/studies/StudyForm'
import Breadcrumbs from '@/components/Breadcrumbs'
import {useAuthStore} from '@/firebase/AuthClient'
import {Spacer} from '@heroui/spacer'
import {useParams} from 'next/navigation'

export default function CreateStudyPage() {
  const params = useParams()
  const {admin, loading} = useAuthStore()

  if (loading) return <div>Loading...</div>
  if (!admin) return <div>Unauthorized</div>

  return (
    <>
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/admin', title: 'Admin'},
          {href: '/admin/studies', title: 'Studies'},
          {title: 'Create'},
        ]}
      />
      <Spacer y={4} />
      <div className="container mx-auto max-w-3xl px-6">
        <h1 className="mb-6 text-2xl font-bold">Create Study</h1>
        <StudyForm
          study={{
            id: params.studyId as string,
            title: '',
            date: '',
            photos: [],
          }}
        />
      </div>
    </>
  )
}
