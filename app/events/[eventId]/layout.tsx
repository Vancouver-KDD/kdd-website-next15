import {Spacer} from '@heroui/spacer'

export default function EventsLayout({children}: {children: React.ReactNode}) {
  return (
    <section className="flex flex-col items-center">
      <Spacer y={20} />
      {children}
    </section>
  )
}
