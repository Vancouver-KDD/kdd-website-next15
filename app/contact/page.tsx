'use client'
import {DiscordIcon, EmailIcon, InstagramIcon} from '@/components/icons'
import {sectionSubtitle, sectionTitle, subtitle, title} from '@/components/primitives'
import {siteConfig} from '@/config/site'
import {useTranslation} from '@/lib/i18n'
import en from '@/dictionaries/en.json'
import ko from '@/dictionaries/ko.json'
import {Button} from '@heroui/button'
import {Link} from '@heroui/link'
import {Snippet} from '@heroui/snippet'
import {Spacer} from '@heroui/spacer'

export default function ContactPage() {
  const {t} = useTranslation({...en, ...ko})
  return (
    <>
      <div className="mx-auto flex max-w-5xl flex-col items-start px-6">
        <h1 className={title()}>{t('contact.hero.title')}</h1>
        <Spacer y={4} />
        <h3 className={subtitle({className: 'text-start whitespace-pre-line'})}>
          {t('contact.hero.subtitle')}
        </h3>
      </div>
      <Spacer y={40} />
      <div className="bg-background0 flex w-full flex-col items-center pt-4">
        <Spacer y={36} />
        <div className={sectionTitle()}>{t('nav.contact_us')}</div>
        <div className={sectionSubtitle()}>{t('contact.sections.subtitle')}</div>
        <Spacer y={32} />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-2">
              <EmailIcon size={28} className="drop-shadow-lg" />
              <span className="text-xl font-semibold">{t('contact.sections.email')}</span>
            </div>
            <Snippet symbol="" className="shadow-lg">
              vancouverkdd@gmail.com
            </Snippet>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-2">
              <DiscordIcon size={28} className="drop-shadow-lg" />
              <span className="text-xl font-semibold">{t('contact.sections.discord')}</span>
            </div>
            <Link
              href={siteConfig.links.discord}
              isExternal
              className="flex flex-col items-center gap-2">
              <Button size="md" variant="flat" className="shadow-lg">
                {t('contact.buttons.discord')}
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-2">
              <InstagramIcon size={28} className="drop-shadow-lg" />
              <span className="text-xl font-semibold">{t('contact.sections.instagram')}</span>
            </div>
            <Link
              href={siteConfig.links.instagram}
              isExternal
              className="flex flex-col items-center gap-2">
              <Button size="md" variant="flat" className="shadow-lg">
                {t('contact.buttons.instagram')}
              </Button>
            </Link>
          </div>
        </div>
        <Spacer y={40} />
      </div>
    </>
  )
}
