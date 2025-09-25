'use client'
import {useSelectedEventStore} from '@/app/store'
import {formatISODate} from '@/lib/utils'
import {Calendar, DateValue} from '@heroui/calendar'
import {getLocalTimeZone, parseDate, today} from '@internationalized/date'

export default function UpcomingEventsCalendar({events}: {events: {date: string; id: string}[]}) {
  const {selectedEventId, setSelectedEventId} = useSelectedEventStore()

  // Convert ISO dates to PDT date strings for calendar parsing
  const eventsWithLocaleDates = events.map((e) => ({
    ...e,
    localeDateString: formatISODate(e.date),
  }))

  const value = selectedEventId
    ? parseDate(eventsWithLocaleDates.find((e) => e.id === selectedEventId)?.localeDateString ?? '')
    : eventsWithLocaleDates[0]
      ? parseDate(eventsWithLocaleDates[0].localeDateString)
      : null
  return (
    <Calendar
      key={value?.toString()}
      aria-label="Upcoming Events Calendar"
      value={value as any}
      minValue={
        eventsWithLocaleDates[0]
          ? parseDate(eventsWithLocaleDates[0].localeDateString)
          : today(getLocalTimeZone())
      }
      maxValue={
        eventsWithLocaleDates[eventsWithLocaleDates.length - 1]
          ? parseDate(eventsWithLocaleDates[eventsWithLocaleDates.length - 1].localeDateString)
          : today(getLocalTimeZone())
      }
      onChange={(value) => {
        if (value) {
          setSelectedEventId(
            eventsWithLocaleDates.find((e) => e.localeDateString === value.toString())?.id ?? null
          )
        } else {
          setSelectedEventId(null)
        }
      }}
      isDateUnavailable={(_date: DateValue) => {
        // Check if _date is part of dates
        return !eventsWithLocaleDates.some((e) => {
          const date = parseDate(e.localeDateString)
          const minDate = parseDate(eventsWithLocaleDates[0].localeDateString)
          const maxDate = parseDate(
            eventsWithLocaleDates[eventsWithLocaleDates.length - 1].localeDateString
          )
          // check if _date is before events[0].localeDateString or after events[events.length - 1].localeDateString
          // If so, return true, since it is already covered by the min and max values so it is already unavailable
          if (_date < minDate || _date > maxDate) {
            return true
          }
          // Return true if and only if the date is the same as the event date
          return date.day === _date.day && date.month === _date.month && date.year === _date.year
        })
      }}
    />
  )
}
