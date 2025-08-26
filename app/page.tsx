import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'

import {subtitle, heroTitle} from '@/components/primitives'

export default function Home() {
  return (
    <section className="mx-auto flex max-w-lg flex-col gap-4 py-8 md:py-10">
      <span className={heroTitle()}>Knowledge.</span>
      <span className={heroTitle()}>Diversity.</span>
      <span className={heroTitle()}>Drive.</span>
      <div className={subtitle({class: 'mt-4'})}>
        KDD는 지식을 나누고, 새로운 가능성을 발견하며, 함께 성장하는 한인 IT 커뮤니티입니다.
      </div>

      <div className="flex gap-3">
        <Link className={buttonStyles({variant: 'bordered', radius: 'full'})} href={'/about'}>
          KDD 소개
        </Link>
        <Link
          className={buttonStyles({
            color: 'primary',
            radius: 'full',
            variant: 'shadow',
          })}
          href={'/events'}>
          다음 이벤트
        </Link>
      </div>
    </section>
  )
}
