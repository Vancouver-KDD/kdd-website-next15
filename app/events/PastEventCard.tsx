'use client'
import {CardFooter} from '@heroui/card'
import {Image} from '@heroui/image'
import {Card} from '@heroui/card'
import {Link} from '@heroui/link'

export default function PastEventCard({
  id,
  title,
  image,
  date,
}: {
  id: string
  title: string
  image?: string
  date: string
}) {
  return (
    <Link href={`/events/${id}`}>
      <Card isHoverable shadow="lg" className="max-h-[313px] justify-center">
        <Image draggable={false} src={image} width={'100%'} className="min-h-56" isZoomed />
        <CardFooter className="absolute bottom-0 z-10 flex flex-col items-start bg-white/30 text-start backdrop-blur">
          <div className="text-sm text-black">{date}</div>
          <div className="text-sm text-black">{title}</div>
        </CardFooter>
      </Card>
    </Link>
  )
}
