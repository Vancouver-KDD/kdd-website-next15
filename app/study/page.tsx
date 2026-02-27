import {getFutureStudies, getPastStudies} from '@/firebase/actions/study'
import StudyClient from './StudyClient'

export default async function StudyPage() {
  const [fetchedFutureStudies, fetchedPastStudies] = await Promise.all([getFutureStudies(), getPastStudies()])

  const now = new Date()
  
  // Future studies without the isOngoing override
  const futureStudies = fetchedFutureStudies.filter((study) => !study.isOngoing)
  
  // Future studies WITH the isOngoing override PLUS past studies with the isOngoing override or naturally ongoing
  const ongoingStudies = [
    ...fetchedFutureStudies.filter((study) => study.isOngoing),
    ...fetchedPastStudies.filter((study) => study.isOngoing || (study.endDate && new Date(study.endDate) >= now)),
  ]

  // Past studies WITHOUT the isOngoing override AND whose end date is genuinely past (or absent)
  const strictlyPastStudies = fetchedPastStudies.filter(
    (study) => !study.isOngoing && (!study.endDate || new Date(study.endDate) < now)
  )

  return (
    <StudyClient
      futureStudies={futureStudies}
      ongoingStudies={ongoingStudies}
      pastStudies={strictlyPastStudies}
    />
  )
}
