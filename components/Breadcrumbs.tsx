'use client'
import {BreadcrumbItem, Breadcrumbs as HerouiBreadcrumbs} from '@heroui/breadcrumbs'

export default function Breadcrumbs({paths}: {paths: {href?: string; title: string}[]}) {
  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col items-start px-6">
      <HerouiBreadcrumbs>
        {paths.map((path) => (
          <BreadcrumbItem key={path.href} href={path.href}>
            {path.title}
          </BreadcrumbItem>
        ))}
      </HerouiBreadcrumbs>
    </div>
  )
}
