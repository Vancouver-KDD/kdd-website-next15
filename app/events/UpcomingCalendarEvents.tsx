'use client'
import {Calendar, DateValue} from '@heroui/calendar'
import {today, getLocalTimeZone} from '@internationalized/date'
import UpcomingEvents from '../UpcomingEvents'
import {Spacer} from '@heroui/spacer'

export default function UpcomingCalendarEvents() {
  return (
    <>
      <Calendar
        aria-label="Date (No Selection)"
        minValue={today(getLocalTimeZone())}
        maxValue={today(getLocalTimeZone())}
        isDateUnavailable={(date: DateValue) => {
          return true
        }}
      />
      <Spacer y={20} />
      <UpcomingEvents />
    </>
  )
}
