import {getFutureStudies, getPastStudies} from '@/firebase/actions/study'
import StudyClient from './StudyClient'

export default async function StudyPage() {
  const [futureStudies, pastStudies] = await Promise.all([getFutureStudies(), getPastStudies()])
  return <StudyClient futureStudies={futureStudies} pastStudies={pastStudies} />
}
