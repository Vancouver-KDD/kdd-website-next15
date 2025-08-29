'use client'
import {Card, CardBody, CardFooter} from '@heroui/card'
import {sectionTitle} from '@/components/primitives'
import {Image} from '@heroui/image'
import {Spacer} from '@heroui/spacer'

export default function WhatWeOfferSection() {
  return (
    <section className="mx-auto w-full max-w-screen-lg text-center">
      <div className={sectionTitle()}>What We Offer</div>
      <Spacer y={4} />
      <div className="grid grid-cols-1 place-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:nth-child(-n+3)]:place-self-start sm:[&>*:nth-child(4n-2)]:place-self-start sm:[&>*:nth-child(4n-3)]:place-self-start">
        {[
          {
            title: 'Monthly Meet Up',
            img: 'https://placehold.co/250x262/png?font=noto%20sans',
          },
          {
            title: 'Annual IT Conference',
            img: 'https://placehold.co/250x262/png?font=noto%20sans',
          },
          {
            title: 'Study Groups',
            img: 'https://placehold.co/250x262/png?font=noto%20sans',
          },
          {
            title: 'Mentorships',
            img: 'https://placehold.co/250x262/png?font=noto%20sans',
          },
          {
            title: 'Christmas Party',
            img: 'https://placehold.co/250x262/png?font=noto%20sans',
          },
          {
            title: 'Summer BBQ Party',
            img: 'https://placehold.co/250x262/png?font=noto%20sans',
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="h-[310px] w-[250px]"
            isPressable
            shadow="sm"
            onPress={() => console.log('item pressed')}>
            <CardBody className="overflow-visible p-0">
              <Image
                alt={item.title}
                className="h-[262px] w-full object-cover"
                radius="none"
                src={item.img}
                width="100%"
              />
            </CardBody>
            <CardFooter className="text-small justify-center">
              <b>{item.title}</b>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
