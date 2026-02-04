'use client'
import {formatISODate, generateGradientSVG} from '@/lib/utils'
import {Card, CardFooter} from '@heroui/card'
import {Image} from '@heroui/image'
import {Link} from '@heroui/link'
import {Images} from 'lucide-react'
import {Photo} from 'react-photo-album/dist/types'

export default function PastStudyCard({
  id,
  title,
  image,
  date,
  photos,
}: {
  id: string
  title: string
  image?: string
  date: string
  photos?: Photo[]
}) {
  return (
    <div className="group relative">
      <Link href={`/study/${id}#details`}>
        <Card isHoverable shadow="lg" className="max-h-[313px] justify-center">
          <Image
            draggable={false}
            src={image || generateGradientSVG(title)}
            width={'100%'}
            className="min-h-56"
            isZoomed
          />

          <CardFooter className="absolute bottom-0 z-10 flex flex-col items-start bg-white/30 pr-5 text-start backdrop-blur">
            <div className="text-sm text-black">{formatISODate(date)}</div>
            <div className="text-sm text-black">{title}</div>
          </CardFooter>
        </Card>
      </Link>
      {photos && photos.length > 0 && (
        <Link
          href={`/study/${id}#photos`}
          className="text-foreground-800 absolute right-2 bottom-5 z-20">
          <Images className="h-5 w-5" />
        </Link>
      )}
    </div>
  )
}
