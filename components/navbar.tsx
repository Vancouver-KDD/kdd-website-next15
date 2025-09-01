'use client'
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@heroui/navbar'
import {Button} from '@heroui/button'
import {Link} from '@heroui/link'
import {link as linkStyles} from '@heroui/theme'
import clsx from 'clsx'
import {siteConfig} from '@/config/site'
import {ThemeSwitch} from '@/components/theme-switch'
import {HeartFilledIcon, Logo} from '@/components/icons'
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover'
import {Snippet} from '@heroui/snippet'
import JumpToTopButton from './JumpToTopButton'
import {useState} from 'react'

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <HeroUINavbar
        maxWidth="lg"
        position="sticky"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}>
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <Link className="flex items-center justify-start gap-1" href="/">
            <Logo width={80} className="object-contain" />
          </Link>
        </NavbarBrand>
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <ul className="ml-2 hidden justify-start sm:flex">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({color: 'foreground'}),
                    'data-[active=true]:text-primary data-[active=true]:font-medium'
                  )}
                  color="foreground"
                  href={item.href}
                  isBlock>
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent className="hidden basis-1/5 sm:flex sm:basis-full" justify="end">
          <NavbarItem className="hidden gap-2 sm:flex">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden sm:flex">
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button
                  className="text-default-600 bg-default-100 text-sm font-normal"
                  startContent={<HeartFilledIcon className="text-danger" />}
                  variant="flat">
                  스폰서
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small pb-1 pl-3 font-bold">
                    Support us with $5 e-transfer
                  </div>
                  <Snippet symbol="">vancouverkdd@gmail.com</Snippet>
                </div>
              </PopoverContent>
            </Popover>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle className="cursor-pointer" />
        </NavbarContent>

        <NavbarMenu>
          <div className="flex flex-col gap-2 not-sm:mt-2">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="flex justify-center"
                  color={'foreground'}
                  href={item.href}
                  size="lg"
                  onPress={handleMenuClose}>
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
        </NavbarMenu>
      </HeroUINavbar>
      <JumpToTopButton />
    </>
  )
}
