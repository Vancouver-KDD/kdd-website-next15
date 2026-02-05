'use client'
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
import {
  label as labelStyles,
  sectionSubtitle,
  sectionTitle,
  subtitle,
  title,
} from '@/components/primitives'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import {Divider} from '@heroui/divider'
import {Image} from '@heroui/image'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles} from '@heroui/theme'
import NextImage from 'next/image'
import kddAbout from './kdd-about1.avif'
import members from './members.json'

export default function AboutPage() {
  const {t} = useTranslation({...en, ...ko})
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-5xl flex-col">
        <section className="max-w-[588px] self-start px-6">
          <span className={title()}>{t('about.hero.title')}</span>
          <h1 className={title({color: 'kdd', className: 'pr-1 italic'})}> KDD</h1>
          <Spacer y={4} />
          <h3 className={subtitle()}>
            {t('about.hero.subtitle')}
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
            href={'/events#upcoming-events'}>
            {t('about.join_event')}
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
            <h1 className={sectionTitle()}>{t('about.story.title')}</h1>
            <Spacer y={9} />
            <p className="text-lg whitespace-pre-line">
              {t('about.story.description')}
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
            {t('about.values.title')}
          </h1>
          <span className={sectionSubtitle()}>{t('about.values.subtitle')}</span>
        </div>
        <Spacer y={16} />
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <section className="grid grid-cols-1 justify-items-center gap-22 text-center sm:grid-cols-[repeat(2,minmax(0,249px))] sm:place-content-center sm:justify-items-start sm:text-start lg:grid-cols-[repeat(3,minmax(0,249px))]">
            <Label
              icon="🤝"
              label={t('about.values.items.sharing')}
              description={t('about.values.items.sharing_desc')}
            />
            <Label
              icon="🌱"
              label={t('about.values.items.growth')}
              description={t('about.values.items.growth_desc')}
            />
            <Label
              icon="👥"
              label={t('about.values.items.connections')}
              description={t('about.values.items.connections_desc')}
            />
            <Label
              icon="✨"
              label={t('about.values.items.inspiration')}
              description={t('about.values.items.inspiration_desc')}
            />
            <Label
              icon="🌎"
              label={t('about.values.items.collaboration')}
              description={t('about.values.items.collaboration_desc')}
            />
            <Label
              icon="💼"
              label={t('about.values.items.opportunity')}
              description={t('about.values.items.opportunity_desc')}
            />
          </section>
        </div>
        <Spacer className="h-20 md:h-40" />
      </div>
      <div className="bg-background w-full">
        <Spacer className="h-20 md:h-40" />
        <div className="flex flex-col items-center">
          <h1 id="meet-the-team" className={sectionTitle()}>
            {t('about.team.title')}
          </h1>
          <span className={sectionSubtitle()}>
            {t('about.team.subtitle')}
          </span>
          <Spacer y={16} />
          <div className={labelStyles()}>Leadership</div>
          <div className="w-full max-w-5xl self-center px-4 py-9 sm:px-12">
            <div className="flex flex-wrap items-end justify-center gap-10 sm:gap-20">
              {members.Leadership.map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Operation Team</div>
          <div className="w-full max-w-5xl self-center px-4 py-9 sm:px-12">
            <div className="flex flex-wrap items-end justify-center gap-10 sm:gap-20">
              {members['Operations Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Study Team</div>
          <div className="w-full max-w-5xl self-center px-4 py-9 sm:px-12">
            <div className="flex flex-wrap items-end justify-center gap-10 sm:gap-20">
              {members['Study Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Design Team</div>
          <div className="w-full max-w-5xl self-center px-4 py-9 sm:px-12">
            <div className="flex flex-wrap items-end justify-center gap-10 sm:gap-20">
              {members['Design Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
            <Divider orientation="horizontal" className="my-9" />
          </div>
          <div className={labelStyles()}>Marketing Team</div>
          <div className="w-full max-w-5xl self-center px-4 py-9 sm:px-12">
            <div className="flex flex-wrap items-end justify-center gap-10 sm:gap-20">
              {members['Marketing Team'].map((member, index) => (
                <CardMember key={index} {...member} />
              ))}
            </div>
          </div>
          <div className="bg-background0 flex flex-col items-center self-stretch">
            <Spacer y={24} />
            <div className={labelStyles()}>Board Members</div>
            <div className="w-full max-w-5xl self-center px-4 py-9 sm:px-12">
              <div className="grid grid-cols-2 items-end gap-10 place-self-center md:grid-cols-[repeat(3,minmax(0,200px))]">
                {members['Board Members'].map((member, index) => (
                  <CardMember key={index} {...member} />
                ))}
              </div>
            </div>
            <Spacer className="h-20 md:h-40" />
          </div>
          <div className="bg-background flex flex-col items-center self-stretch">
            <Spacer y={24} />
            <div className={labelStyles()}>{t('about.team.past_chairs')}</div>
            <div className="w-full self-center px-4 py-9 sm:px-12">
              <div className="flex flex-col items-center">
                {members['Past Chairs'].map((member, index) => (
                  <CardPastChair
                    key={index}
                    {...member}
                    isFirst={index === 0}
                    isLast={index === members['Past Chairs'].length - 1}
                  />
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

const CardPastChair = ({
  title,
  image,
  name,
  englishName,
  socialLinks,
  isFirst,
  isLast,
}: {
  title?: string
  image: string
  name: string
  englishName?: string
  socialLinks: {
    type: string
    url: string
  }[]
  isFirst?: boolean
  isLast?: boolean
}) => {
  return (
    <div className="relative flex min-h-[120px] w-full justify-center py-6 transition-colors hover:bg-default-50/50">
      {/* Timeline Vertical line in the middle */}
      <div className="absolute inset-y-0 left-1/2 flex w-0.5 -translate-x-1/2 flex-col items-center">
        <div className={`w-full flex-1 ${isFirst ? 'bg-transparent' : 'bg-default-200'}`} />
        <div className="bg-default-400 z-10 h-3 w-3 shrink-0 rounded-full md:h-4 md:w-4" />
        <div className={`w-full flex-1 ${isLast ? 'bg-transparent' : 'bg-default-200'}`} />
      </div>

      {/* Content Split: Year on Left, Profile on Right */}
      <div className="flex w-full max-w-2xl items-center">
        {/* Left Side: Year */}
        <div className="flex flex-1 justify-end pr-8 md:pr-12">
          <div className="text-default-500 font-medium text-sm md:text-base">
            {title}
          </div>
        </div>

        {/* Right Side: Profile */}
        <div className="flex flex-1 items-center gap-4 pl-8 md:gap-6 md:pl-12">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm md:h-20 md:w-20">
            {image ? (
              <Image
                as={NextImage}
                src={image}
                alt={name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-default-100 flex h-full w-full items-center justify-center text-4xl">
                👤
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold md:text-xl">{name}</div>
              <Link
                href={socialLinks.find((link) => link.type === 'linkedin')?.url || '#'}
                isExternal
                className="transition-transform hover:scale-110">
                <LinkedInIcon size={20} className="text-default-600" />
              </Link>
            </div>
            {englishName && (
              <div className="text-default-400 text-sm md:text-base">{englishName}</div>
            )}
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
  englishName,
  description1,
  description2,
  socialLinks,
}: {
  title?: string
  image: string
  name: string
  englishName?: string
  description1: string
  description2: string
  socialLinks: {
    type: string
    url: string
  }[]
}) => {
  return (
    <div className="flex max-w-[200px] flex-col items-center gap-5 text-center">
      <div className="flex flex-col items-center">
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
      <div className="flex flex-col items-center">
        <div className="text-sm font-semibold">{name}</div>
        {englishName && <div className="text-default-500 text-xs">{englishName}</div>}
        <Link
          href={socialLinks.find((link) => link.type === 'linkedin')?.url || '#'}
          isExternal
          className="mt-1 transition-transform hover:scale-110">
          <LinkedInIcon size={20} className="text-default-800" />
        </Link>
        <div className="text-default-500 text-sm">{description1}</div>
        <div className="text-default-500 text-sm">{description2}</div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 px-2 drop-shadow-md">
        {socialLinks
          .filter((link) => link.type !== 'linkedin')
          .map((link, index) => (
            <Link
              key={index}
              href={link.type === 'email' ? `mailto:${link.url}` : link.url}
              isExternal>
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
