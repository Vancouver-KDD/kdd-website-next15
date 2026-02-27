import Breadcrumbs from '@/components/Breadcrumbs'
import {getStudy} from '@/firebase/actions/study'
import {formatISODate} from '@/lib/utils'
import {Divider} from '@heroui/divider'
import {Spacer} from '@heroui/spacer'
import AdminEditButton from '@/components/admin/AdminEditButton'
import Tabs from './Tabs'

export default async function StudyPage({params}: {params: Promise<{studyId: string}>}) {
  const {studyId} = await params
  const study = await getStudy(studyId)

  return (
    <div className="relative">
      {study && <AdminEditButton editUrl={`/admin/studies/${study.id}/edit`} />}
      <Breadcrumbs
        paths={[
          {href: '/', title: 'Home'},
          {href: '/study', title: 'Studies'},
          {title: study?.title || 'Study Not Found'},
        ]}
      />
      {study ? (
        <>
          <div className="mx-auto flex max-w-5xl flex-col items-start px-6">
            <Divider className="my-6" />
            <div className="text-content1-foreground font-bold opacity-60">
              {study.type || 'STUDY'}
            </div>
            <div className="text-content1-foreground font-medium opacity-50">
              {formatISODate(study.date)} | {study?.location}
            </div>
          </div>
          <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
            <Spacer y={4} />
            <div className="mb-8 self-stretch text-start text-4xl font-black md:mb-16 md:text-6xl">
              {study.title}
            </div>
            <Tabs event={study as any} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="text-xl font-bold">
            The study you are looking for does not exist or was deleted.
          </h1>
        </div>
      )}
    </div>
  )
}
