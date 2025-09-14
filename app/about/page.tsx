import {
  sectionSubtitle,
  sectionTitle,
  subtitle,
  title,
  label as labelStyles,
} from '@/components/primitives'
import {Link} from '@heroui/link'
import {button as buttonStyles} from '@heroui/theme'
import NextImage from 'next/image'
import {Image} from '@heroui/image'
import kddAbout from './kdd-about1.avif'
import {Divider} from '@heroui/divider'
import {Spacer} from '@heroui/spacer'
import {
  DiscordIcon,
  EmailIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  LinkIcon,
  ThreadsIcon,
  TwitterIcon,
} from '@/components/icons'
import members from './members.json'

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-screen-lg flex-col">
        <section className="max-w-[588px] self-start px-6">
          <span className={title()}>About</span>
          <h1 className={title({color: 'kdd', className: 'pr-1 italic'})}> KDD</h1>
          <Spacer y={4} />
          <h3 className={subtitle()}>
            KDD는 지식을 나누고, 새로운 가능성을 발견하며, 함께 성장하는 한인 IT 커뮤니티입니다.
          </h3>
          <Spacer y={6} />
          <Link
            className={buttonStyles({
              variant: 'shadow',
              radius: 'sm',
              size: 'md',
              color: 'default',
              className: 'bg-default-100 font-light drop-shadow-lg',
            })}
            href={'/events'}>
            Join our Next Event
          </Link>
        </section>
        <section className="flex flex-col items-end self-stretch">
          <NextImage
            src={kddAbout}
            alt="KDD About"
            width={279}
            height={257}
            className="mb-[-37px] h-auto"
          />
        </section>
        <Divider orientation="horizontal" />
        <section className="self-center px-6 md:px-[96px]">
          <div className="max-w-[734px] py-16">
            <h1 className={sectionTitle()}>Our Story</h1>
            <Spacer y={9} />
            <p className="text-lg">
              KDD는 2017년, 밴쿠버에서 활동하던 한 개발자의 작은 바람에서 시작되었습니다.
              <br />
              <br />
              “서로 다른 분야의 한인이 모여, 함께 이야기하고 시너지를 내어 무언가를 도모할 수 있는
              장이 있으면 좋겠다”는 마음이 출발점이었습니다.
              <br />
              <br />첫 만남 이후, 뜻을 함께하는 사람들이 점차 늘어나면서 KDD는 
              <b>한인 IT 종사자들이 자유롭게 연결되고 성장할 수 있는 커뮤니티</b>로 자리 잡았습니다.
              <br />
              <br />
              오늘날 KDD는 정기적인 밋업, 멘토링, 연례 컨퍼런스를 통해 지식과 경험을 공유하며, 한인
              IT 커뮤니티의 지속적인 성장과 전문적 네트워킹을 지원하는 플랫폼으로 발전해가고
              있습니다.
            </p>
          </div>
        </section>
        <Divider orientation="horizontal" />
        <Spacer className="h-20 md:h-40" />
      </div>
      <div className="bg-background0 w-full">
        <Spacer className="h-20 md:h-40" />
        <div className="flex flex-col items-center">
          <h1 id="values" className={sectionTitle()}>
            Values
          </h1>
          <span className={sectionSubtitle()}>KDD가 함께 만들어가는 여섯 가지 마음</span>
        </div>
        <Spacer y={16} />
        <div className="mx-auto max-w-screen-lg px-6 md:px-12">
          <section className="grid grid-cols-1 justify-items-center gap-22 text-center sm:grid-cols-[repeat(2,minmax(0,249px))] sm:place-content-center sm:justify-items-start sm:text-start lg:grid-cols-[repeat(3,minmax(0,249px))]">
            <Label
              icon="🤝"
              label="Sharing"
              description="지식과 경험을 나누며 함께 성장할 수 있는 장을 제공합니다."
            />
            <Label
              icon="🌱"
              label="Growth"
              description="전문성을 키우고 네트워크를 확장할 기회를 제공합니다."
            />
            <Label
              icon="👥"
              label="Connections"
              description="언제든 의지하고 도움을 얻을 수 있는 커뮤니티를 제공합니다."
            />
            <Label
              icon="✨"
              label="Inspiration"
              description="새로운 시도와 다양한 이야기로 창의적 변화를 이끌어냅니다."
            />
            <Label
              icon="🌎"
              label="Collaboration"
              description="협력 프로젝트와 파트너십을 통해 더 큰 가능성을 만듭니다."
            />
            <Label
              icon="💼"
              label="Opportunity"
              description="커리어와 성장을 위한 발판을 제공합니다."
            />
          </section>
        </div>
        <Spacer className="h-20 md:h-40" />
      </div>
      <div className="bg-background w-full">
        <Spacer className="h-20 md:h-40" />
        <div className="flex flex-col items-center">
          <h1 id="meet-the-team" className={sectionTitle()}>
            Meet the Team
          </h1>
          <span className={sectionSubtitle()}>
            마음을 모아 KDD를 만들어가는 운영진을 소개합니다.
          </span>
          <Spacer y={16} />
          <div className={labelStyles()}>Leadership</div>
          <div className="w-full max-w-screen-lg self-center px-4 py-9 sm:px-12">
            <div className="grid grid-cols-2 place-items-center gap-y-10 sm:gap-y-20 md:grid-cols-4">
              {members.Leadership.map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Partner Team</div>
          <div className="w-full max-w-screen-lg self-center px-4 py-9 sm:px-12">
            <div className="grid grid-cols-2 gap-10 place-self-center md:grid-cols-[repeat(3,minmax(0,200px))]">
              {members['Partner Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Study Team</div>
          <div className="w-full max-w-screen-lg self-center px-4 py-9 sm:px-12">
            <div className="grid grid-cols-[repeat(2,minmax(0,200px))] justify-center justify-items-center gap-10">
              {members['Study Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Design Team</div>
          <div className="w-full max-w-screen-lg self-center px-4 py-9 sm:px-12">
            <div className="grid grid-cols-2 gap-10 place-self-center md:grid-cols-[repeat(3,minmax(0,200px))]">
              {members['Design Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Marketing Team</div>
          <div className="w-full max-w-screen-lg self-center px-4 py-9 sm:px-12">
            <div className="grid grid-cols-[repeat(2,minmax(0,200px))] justify-center justify-items-center gap-10">
              {members['Marketing Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Operation Team</div>
          <div className="w-full max-w-screen-lg self-center px-4 py-9 sm:px-12">
            <div className="grid grid-cols-1 justify-center justify-items-center gap-10">
              {members['Operations Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
          </div>
          <div className="bg-background0 flex flex-col items-center self-stretch">
            <Spacer y={24} />
            <div className={labelStyles()}>Board Members</div>
            <div className="w-full max-w-screen-lg self-center px-4 py-9 sm:px-12">
              <div className="grid grid-cols-2 gap-10 place-self-center md:grid-cols-[repeat(3,minmax(0,200px))]">
                {members['Board Members'].map((member, index) => (
                  <CardMember key={index} {...member} />
                ))}
              </div>
            </div>
            <Spacer className="h-20 md:h-40" />
          </div>
        </div>
      </div>
    </div>
  )
}

const Label = ({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode
  label: string
  description: string
}) => {
  return (
    <div className="flex max-w-[249px] flex-col gap-2">
      <div className="text-4xl">{icon}</div>
      <div className={labelStyles()}>{label}</div>
      <div className="text-default-500 text-lg">{description}</div>
    </div>
  )
}

const CardMember = ({
  title,
  image,
  name,
  description1,
  description2,
  socialLinks,
}: {
  title?: string
  image: string
  name: string
  description1: string
  description2: string
  socialLinks: {
    type:
      | 'linkedin'
      | 'github'
      | 'email'
      | 'website'
      | 'instagram'
      | 'facebook'
      | 'twitter'
      | 'discord'
      | 'threads'
    url: string
  }[]
}) => {
  return (
    <div className="flex max-w-[200px] flex-col items-center gap-5 text-center">
      <div>
        <div className="text-default-500 mb-1 text-sm">{title}</div>
        <Image
          as={NextImage}
          src={image}
          alt={name}
          width={120}
          height={120}
          radius="full"
          isZoomed
          shadow="md"
          quality={100}
        />
      </div>
      <div>
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-default-500 text-sm">{description1}</div>
        <div className="text-default-500 text-sm">{description2}</div>
      </div>
      <div className="flex flex-wrap gap-2 px-2 drop-shadow-md">
        {socialLinks.map((link, index) => (
          <Link
            key={index}
            href={link.type === 'email' ? `mailto:${link.url}` : link.url}
            isExternal>
            {link.type === 'linkedin' && <LinkedInIcon size={24} className="text-default-800" />}
            {link.type === 'github' && <GithubIcon size={24} className="text-default-800" />}
            {link.type === 'email' && <EmailIcon size={24} className="text-default-800" />}
            {link.type === 'website' && <LinkIcon size={24} className="text-default-800" />}
            {link.type === 'instagram' && <InstagramIcon size={24} className="text-default-800" />}
            {link.type === 'facebook' && <FacebookIcon size={24} className="text-default-800" />}
            {link.type === 'twitter' && <TwitterIcon size={24} className="text-default-800" />}
            {link.type === 'discord' && <DiscordIcon size={24} className="text-default-800" />}
            {link.type === 'threads' && <ThreadsIcon size={24} className="text-default-800" />}
          </Link>
        ))}
      </div>
    </div>
  )
}
