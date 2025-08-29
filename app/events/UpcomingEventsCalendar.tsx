'use client'
import {Calendar, DateValue} from '@heroui/calendar'
import {today, getLocalTimeZone, parseDate} from '@internationalized/date'
import {useSelectedEventStore} from './selectedEventStore'

export default function UpcomingEventsCalendar({events}: {events: {date: string; id: string}[]}) {
  const {selectedEventId, setSelectedEventId} = useSelectedEventStore()
  const value = selectedEventId
    ? parseDate(events.find((e) => e.id === selectedEventId)?.date ?? '')
    : events[0]
      ? parseDate(events[0].date)
      : null
  return (
    <>
      <Calendar
        key={value?.toString()}
        aria-label="Upcoming Events Calendar"
        value={value as any}
        minValue={events[0] ? parseDate(events[0].date) : today(getLocalTimeZone())}
        maxValue={
          events[events.length - 1]
            ? parseDate(events[events.length - 1].date)
            : today(getLocalTimeZone())
        }
        onChange={(value) => {
          if (value) {
            setSelectedEventId(events.find((e) => e.date === value.toString())?.id ?? null)
          } else {
            setSelectedEventId(null)
          }
        }}
        isDateUnavailable={(_date: DateValue) => {
          // Check if _date is part of dates
          return !events.some((e) => {
            const date = parseDate(e.date)
            const minDate = parseDate(events[0].date)
            const maxDate = parseDate(events[events.length - 1].date)
            // check if _date is before events[0].date or after events[events.length - 1].date
            // If so, return true, since it is already covered by the min and max values so it is already unavailable
            if (_date < minDate || _date > maxDate) {
              return true
            }
            // Return true if and only if the date is the same as the event date
            return date.day === _date.day && date.month === _date.month && date.year === _date.year
          })
        }}
      />
    </>
  )
}
