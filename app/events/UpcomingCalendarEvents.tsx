'use client'
import {Calendar, DateValue} from '@heroui/calendar'
import {today, getLocalTimeZone, parseDate} from '@internationalized/date'

export default function UpcomingCalendarEvents({
  selectedDate,
  dates,
}: {
  selectedDate?: string
  dates: string[]
}) {
  return (
    <>
      <Calendar
        aria-label="Date (No Selection)"
        defaultValue={selectedDate ? parseDate(selectedDate) : undefined}
        minValue={dates[0] ? parseDate(dates[0]) : today(getLocalTimeZone())}
        maxValue={
          dates[dates.length - 1] ? parseDate(dates[dates.length - 1]) : today(getLocalTimeZone())
        }
        isDateUnavailable={(_date: DateValue) => {
          // Check if _date is part of dates
          return !dates.some((d) => {
            const date = parseDate(d)
            return date.day === _date.day && date.month === _date.month && date.year === _date.year
          })
        }}
      />
    </>
  )
}
