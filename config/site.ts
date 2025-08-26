export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Vancouver KDD Website',
  description:
    'Vancouver KDD Website for the Vancouver KDD Chapter. Korean Developers and Designers in Vancouver.',
  navItems: [
    {
      label: '소개',
      href: '/about',
    },
    {
      label: 'Events',
      href: '/events',
    },
    {
      label: 'Contact',
      href: '/contact',
    },
  ],
  navMenuItems: [
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Events',
      href: '/events',
    },
    {
      label: 'Contact',
      href: '/contact',
    },
    {
      label: 'Logout',
      href: '/logout',
    },
  ],
  links: {
    github: 'https://github.com/vancouver-kdd',
    threads: 'https://www.threads.com/@kdd.vancouver',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
}
