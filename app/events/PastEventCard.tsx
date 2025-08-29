'use client'
import {CardFooter} from '@heroui/card'
import {Image} from '@heroui/image'
import {Card} from '@heroui/card'

export default function PastEventCard({
  title,
  image,
  date,
}: {
  title: string
  image: string
  date: string
}) {
  return (
    <Card
      onPress={() => alert('event pressed')}
      isPressable
      isHoverable
      shadow="lg"
      className="max-h-[313px] justify-center">
      <Image draggable={false} src={image} width={'100%'} className="min-h-56" />
      <CardFooter className="absolute bottom-0 z-10 flex flex-col items-start bg-white/30 backdrop-blur">
        <div className="text-sm text-black">{date}</div>
        <div className="text-sm text-black">{title}</div>
      </CardFooter>
    </Card>
  )
}
