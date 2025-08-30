import {subtitle, title} from '@/components/primitives'
import {Spacer} from '@heroui/spacer'

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-screen-lg flex-col items-start">
      <h1 className={title()}>Contact</h1>
      <Spacer y={4} />
      <h3 className={subtitle({className: 'text-start'})}>
        궁금한 점이나 협력 제안이 있으신가요?
        <br />
        언제든 KDD에 연락주세요.
      </h3>
    </div>
  )
}
