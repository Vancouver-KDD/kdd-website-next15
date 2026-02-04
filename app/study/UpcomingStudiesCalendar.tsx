'use client'
import {useSelectedEventStore} from '@/app/store'
import {formatISODate} from '@/lib/utils'
import {Calendar, DateValue} from '@heroui/calendar'
import {getLocalTimeZone, parseDate, today} from '@internationalized/date'

export default function UpcomingStudiesCalendar({studies}: {studies: {date: string; id: string}[]}) {
  const {selectedEventId, setSelectedEventId} = useSelectedEventStore()

  const studiesWithLocaleDates = studies.map((s) => ({
    ...s,
    localeDateString: formatISODate(s.date),
  }))

  const value = selectedEventId
    ? parseDate(studiesWithLocaleDates.find((s) => s.id === selectedEventId)?.localeDateString ?? '')
    : studiesWithLocaleDates[0]
      ? parseDate(studiesWithLocaleDates[0].localeDateString)
      : null

  return (
    <Calendar
      key={value?.toString()}
      aria-label="Upcoming Studies Calendar"
      value={value as any}
      minValue={
        (studiesWithLocaleDates[0]
          ? parseDate(studiesWithLocaleDates[0].localeDateString)
          : today(getLocalTimeZone())) as any
      }
      maxValue={
        (studiesWithLocaleDates[studiesWithLocaleDates.length - 1]
          ? parseDate(studiesWithLocaleDates[studiesWithLocaleDates.length - 1].localeDateString)
          : today(getLocalTimeZone())) as any
      }
      onChange={(value) => {
        if (value) {
          setSelectedEventId(
            studiesWithLocaleDates.find((s) => s.localeDateString === value.toString())?.id ?? null
          )
        } else {
          setSelectedEventId(null)
        }
      }}
      isDateUnavailable={(_date: DateValue) => {
        return !studiesWithLocaleDates.some((s) => {
          const date = parseDate(s.localeDateString)
          const minDate = parseDate(studiesWithLocaleDates[0].localeDateString)
          const maxDate = parseDate(
            studiesWithLocaleDates[studiesWithLocaleDates.length - 1].localeDateString
          )
          if ((_date as any) < (minDate as any) || (_date as any) > (maxDate as any)) {
            return true
          }
          return date.day === _date.day && date.month === _date.month && date.year === _date.year
        })
      }}
    />
  )
}
