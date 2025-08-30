import {
  GithubIcon,
  DiscordIcon,
  LinkedInIcon,
  LogoBlack,
  ThreadsIcon,
  InstagramIcon,
  SlackIcon,
  YoutubeIcon,
} from '@/components/icons'
import {Link} from '@heroui/link'
import {tv} from 'tailwind-variants'
import {siteConfig} from '@/config/site'
import {Spacer} from '@heroui/spacer'

const footerLinkStyles = tv({
  base: 'text-foreground flex justify-center md:justify-start',
})

export default function Footer() {
  return (
    <footer>
      <Spacer className="h-10 md:h-20" />
      <div className="flex justify-center p-3">
        <div className="flex w-full max-w-screen-lg flex-col flex-wrap items-center justify-between text-center md:flex-row md:items-start md:text-start">
          <Link href="/">
            <LogoBlack width={100} className="object-contain dark:invert" />
          </Link>
          <div className="m-6 flex flex-col gap-5">
            <span className="text-sm font-semibold">About Us</span>
            <Link className={footerLinkStyles()} href="/about">
              <span className="text-sm">Our Story</span>
            </Link>
            <Link className={footerLinkStyles()} href="/about#vision">
              <span className="text-sm">Vision</span>
            </Link>
            <Link className={footerLinkStyles()} href="/about#mission">
              <span className="text-sm">Mission</span>
            </Link>
          </div>
          <div className="m-6 flex flex-col gap-5">
            <span className="text-sm font-semibold">Events</span>
            <Link className={footerLinkStyles()} href="/events">
              <span className="text-sm">Upcoming Events</span>
            </Link>
            <Link className={footerLinkStyles()} href="/events#past-events">
              <span className="text-sm">Past Events</span>
            </Link>
          </div>
          <div className="m-6 flex flex-col gap-5">
            <span className="text-sm font-semibold">Contact Us</span>
            <Link className={footerLinkStyles()} href="/contact">
              <span className="text-sm">Contact Us</span>
            </Link>
            <Link className={footerLinkStyles()} href="/contact#become-our-sponsor">
              <span className="text-sm">Become Our Sponsor</span>
            </Link>
          </div>
          <ul className="mt-4 flex max-w-40 flex-wrap justify-center md:justify-start">
            <Link
              isExternal
              aria-label="Instagram"
              href={siteConfig.links.instagram}
              className="p-2 drop-shadow-md drop-shadow-gray-400/50">
              <InstagramIcon className="text-default-800" size={24} />
            </Link>
            <Link
              isExternal
              aria-label="Threads"
              href={siteConfig.links.threads}
              className="p-2 drop-shadow-md drop-shadow-gray-400/50">
              <ThreadsIcon className="text-default-800" size={24} />
            </Link>
            <Link
              isExternal
              aria-label="LinkedIn"
              href={siteConfig.links.linkedin}
              className="p-2 drop-shadow-md drop-shadow-gray-400/50">
              <LinkedInIcon className="text-default-800" size={24} />
            </Link>
            <Link
              isExternal
              aria-label="Youtube"
              href={siteConfig.links.youtube}
              className="p-2 drop-shadow-md drop-shadow-gray-400/50">
              <YoutubeIcon className="text-default-800" size={24} />
            </Link>
            <Link
              isExternal
              aria-label="Discord"
              href={siteConfig.links.discord}
              className="p-2 drop-shadow-md drop-shadow-gray-400/50">
              <DiscordIcon className="text-default-800" size={24} />
            </Link>
            <Link
              isExternal
              aria-label="Slack"
              href={siteConfig.links.slack}
              className="p-2 drop-shadow-md drop-shadow-gray-400/50">
              <SlackIcon className="text-default-800" size={24} />
            </Link>
            <Link
              isExternal
              aria-label="Github"
              href={siteConfig.links.github}
              className="p-2 drop-shadow-md drop-shadow-gray-400/50">
              <GithubIcon className="text-default-800" size={24} />
            </Link>
          </ul>
        </div>
      </div>
      <Spacer className="h-10 md:h-20" />
      <div className="text-default-600 w-full p-2 text-center">
        Copyright © {new Date().getFullYear()} Vancouver KDD
      </div>
    </footer>
  )
}
