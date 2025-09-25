export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Vancouver KDD Website',
  description:
    'Vancouver KDD Website for the Vancouver KDD Chapter. Korean Developers and Designers in Vancouver.',
  navItems: [
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
  ],
  links: {
    instagram: 'https://www.instagram.com/kdd.vancouver/',
    threads: 'https://www.threads.com/@kdd.vancouver',
    linkedin: 'https://ca.linkedin.com/company/vancouver-kdd',
    youtube: 'https://www.youtube.com/@vancouverkdd',
    discord: 'https://discord.gg/2BZB5GqWQf',
    slack:
      'https://join.slack.com/t/vancouverkdd/shared_invite/zt-1xyhcghtg-OIgE_8OO_SmBMpyOPuH5Ew',
    github: 'https://github.com/vancouver-kdd',
  },
}
