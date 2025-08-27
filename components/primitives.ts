import {tv} from 'tailwind-variants'

export const heroTitle = tv({
  base: 'text-5xl font-medium tracking-tight first-letter:font-black lg:text-6xl',
})

export const title = tv({
  base: 'inline text-4xl font-black md:text-6xl',
  variants: {
    color: {
      kdd: 'from-[#c93796] from-25% via-[#6243b6] via-45% to-[#028fcf] to-80%',
      violet: 'from-[#FF1CF7] to-[#FF7249f8]',
      yellow: 'from-[#FF705B] to-[#FFB457]',
      blue: 'from-[#5EA2EF] to-[#0072F5]',
      cyan: 'from-[#00b7fa] to-[#01cfea]',
      green: 'from-[#6FEE8D] to-[#17c964]',
      pink: 'from-[#FF72E1] to-[#F54C7A]',
      foreground: 'dark:from-[#FFFFFF] dark:to-[#4B4B4B]',
    },
    size: {
      sm: 'text-3xl lg:text-4xl',
      md: 'text-[2.3rem] lg:text-5xl',
      lg: 'text-4xl lg:text-6xl',
    },
    fullWidth: {
      true: 'block w-full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
  compoundVariants: [
    {
      color: ['kdd', 'violet', 'yellow', 'blue', 'cyan', 'green', 'pink', 'foreground'],
      class: 'bg-gradient-to-br bg-clip-text text-transparent',
    },
  ],
})

export const subtitle = tv({
  base: 'w-full max-w-full text-xl md:w-1/2 lg:text-2xl',
  variants: {
    fullWidth: {
      true: '!w-full',
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
})

export const sectionTitle = tv({
  base: 'mb-2 text-2xl font-semibold md:text-3xl',
})

export const sectionSubtitle = tv({
  base: 'text-content1-foreground text-xs font-semibold opacity-60 md:text-sm',
})
