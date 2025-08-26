import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'
import {subtitle, heroTitle, sectionTitle} from '@/components/primitives'
import Image from 'next/image'
import kddBgConference from './kdd-bg-conference.jpg'
import {Spacer} from '@heroui/spacer'
import {Divider} from '@heroui/divider'

export default function Home() {
  return (
    <div>
      <section className="mx-auto flex max-w-lg flex-col py-8 md:py-10">
        <span className={heroTitle()}>Knowledge.</span>
        <span className={heroTitle()}>Diversity.</span>
        <span className={heroTitle()}>Drive.</span>
        <div className={subtitle({className: 'mt-4 mb-6'})}>
          KDD는 지식을 나누고, 새로운 가능성을 발견하며, 함께 성장하는 한인 IT 커뮤니티입니다.
        </div>

        <div className="flex gap-6">
          <Link
            className={buttonStyles({
              variant: 'shadow',
              radius: 'sm',
              size: 'md',
              color: 'default',
              className: 'bg-default-100 font-light drop-shadow-lg',
            })}
            href={'/about'}>
            KDD 소개
          </Link>
          <Link
            className={buttonStyles({
              variant: 'shadow',
              radius: 'sm',
              size: 'md',
              color: 'primary',
              className: 'font-light',
            })}
            href={'/events'}>
            다음 이벤트 보기
          </Link>
        </div>
      </section>
      <Spacer y={40} />
      <section className="h-[507px]">
        <Image
          src={kddBgConference}
          alt="KDD Conference"
          className="absolute right-0 left-0 h-[507px] object-cover"
          objectFit="cover"
        />
        <div className="absolute right-0 left-0 h-[507px] bg-black/60">
          <div className="flex h-full items-center justify-center">
            <div className="max-w-[926px] border-y-1 border-solid border-white px-16 py-8 text-white md:px-24 md:py-12">
              <span className={sectionTitle()}>KDD at a Glance</span>
              <Spacer y={6} />
              <span className="text-md md:text-lg">
                KDD (Korean Developers & Designers)는 2017년 설립된 캐나다 서부 최대 한인 IT
                커뮤니티입니다. 개발자, 디자이너, 기획자, 학생 등 다양한 IT 인재들이 모여 지식과
                경험을 나누고, 협력하며 함께 성장하는 플랫폼으로 발전하고 있습니다.
              </span>
            </div>
          </div>
        </div>
      </section>
      <Spacer y={52} />

      <section className="mx-auto w-full max-w-screen-lg text-center">
        <div className={sectionTitle()}>Upcoming Events</div>
        <Spacer y={2} />
        <span className="text-content1-foreground text-xs font-semibold opacity-60 md:text-sm">
          다가오는 KDD 행사를 만나보세요
        </span>
        <Spacer y={10} />
        <Divider orientation="horizontal" className="bg-foreground-400 w-full" />
        <Spacer y={16} />
        <div className="flex h-[433px] items-center justify-center gap-10">
          <Image
            unoptimized
            src={'https://placehold.co/249x353'}
            alt="upcoming event poster"
            width={249}
            height={353}
            className="max-h-[353px] max-w-[400px] rounded-lg shadow-2xl"
          />
          <div className="flex h-full w-[445px] flex-col justify-center p-3 text-start">
            <div className="text-content1-foreground text-xs font-bold opacity-60">
              ANNUAL CONFERENCE
            </div>
            <Spacer y={0.5} />
            <div className="text-content1-foreground text-xs font-medium opacity-50">
              2025.08.30 | UBC Robson Square
            </div>
            <Spacer y={1} />
            <div className="text-content1-foreground text-2xl font-medium md:text-3xl">
              Technology in Uncertainty
            </div>
            <Spacer y={6} />
            <div className="line-clamp-6">
              불확실한 시대, 기술은 때로 도전이자 기회로 다가옵니다. 이번 세션에서는 변화 속에서
              혁신이 어떻게 우리를 앞으로 이끌고, 함께 성장과 새로운 가능성을 열어가는지를
              이야기합니다. Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, a
              reiciendis. Rem incidunt dignissimos quos esse, obcaecati delectus deserunt ipsa
              nostrum perferendis. Doloremque nisi dolores tempore et quos in iusto. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Similique, a reiciendis. Rem incidunt
              dignissimos quos esse, obcaecati delectus deserunt ipsa nostrum perferendis.
              Doloremque nisi dolores tempore et quos in iusto. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Similique, a reiciendis. Rem incidunt dignissimos quos
              esse, obcaecati delectus deserunt ipsa nostrum perferendis. Doloremque nisi dolores
              tempore et quos in iusto. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Similique, a reiciendis. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Similique, a reiciendis.
            </div>
            <Spacer y={6} />
            <div className="flex gap-4">
              <Link
                className={buttonStyles({
                  variant: 'shadow',
                  radius: 'sm',
                  size: 'md',
                  color: 'default',
                  className: 'bg-default-100 font-light drop-shadow-lg',
                })}
                href={'/events'}>
                전체 이벤트 보기
              </Link>
              <Link
                className={buttonStyles({
                  variant: 'shadow',
                  radius: 'sm',
                  size: 'md',
                  color: 'primary',
                  className: 'font-light',
                })}
                href={'/events'}>
                참여하기
              </Link>
            </div>
            <div className="h-1/12" />
          </div>
        </div>
        <Spacer y={16} />
        <Divider orientation="horizontal" className="bg-foreground-400 w-full" />
        <Spacer y={96} />
      </section>

      <section className="mx-auto w-full max-w-screen-lg text-center">
        <div className={sectionTitle()}>What We Offer</div>
      </section>
    </div>
  )
}
