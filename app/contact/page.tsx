import {DiscordIcon, EmailIcon, InstagramIcon} from '@/components/icons'
import {sectionSubtitle, sectionTitle, subtitle, title} from '@/components/primitives'
import {siteConfig} from '@/config/site'
import {Button} from '@heroui/button'
import {Link} from '@heroui/link'
import {Snippet} from '@heroui/snippet'
import {Spacer} from '@heroui/spacer'

export default function ContactPage() {
  return (
    <>
      <div className="mx-auto flex max-w-screen-lg flex-col items-start px-6">
        <h1 className={title()}>Contact</h1>
        <Spacer y={4} />
        <h3 className={subtitle({className: 'text-start'})}>
          궁금한 점이나 협력 제안이 있으신가요?
          <br />
          언제든 KDD에 연락주세요.
        </h3>
      </div>
      <Spacer y={40} />
      <div className="bg-background0 flex w-full flex-col items-center pt-4">
        <Spacer y={36} />
          <div className={sectionTitle()}>Contact</div>
          <div className={sectionSubtitle()}>KDD와 연결되는 가장 빠른 방법</div>
        <Spacer y={32} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-2">
              <EmailIcon size={28} className="drop-shadow-lg" />
              <span className="text-xl font-semibold">Email Us</span>
            </div>
            <Snippet symbol="" className="shadow-lg">
              vancouverkdd@gmail.com
            </Snippet>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-2">
              <DiscordIcon size={28} className="drop-shadow-lg" />
              <span className="text-xl font-semibold">Join Our Discord</span>
            </div>
            <Link
              href={siteConfig.links.discord}
              isExternal
              className="flex flex-col items-center gap-2">
              <Button size="md" variant="flat" className="shadow-lg">
                Join Discord
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-2">
              <InstagramIcon size={28} className="drop-shadow-lg" />
              <span className="text-xl font-semibold">Follow Us</span>
            </div>
            <Link
              href={siteConfig.links.instagram}
              isExternal
              className="flex flex-col items-center gap-2">
              <Button size="md" variant="flat" className="shadow-lg">
                Follow Us
              </Button>
            </Link>
          </div>
        </div>
        <Spacer y={40} />
      </div>
    </>
  )
}
