'use client'

import {title} from '@/components/primitives'
import {Button} from '@heroui/button'
import {Input, Textarea} from '@heroui/input'
import {Select, SelectItem} from '@heroui/select'
import {Spacer} from '@heroui/spacer'
import {CheckCircle2} from 'lucide-react'
import {useState} from 'react'

const POSITION_OPTIONS = [
  {
    value: 'Marketing Associate - 마케팅 팀 (뉴스레터 담당)',
    label: 'Marketing Associate - 마케팅 팀 (뉴스레터 담당)',
  },
  {
    value: 'Marketing Associate - 마케팅 팀 (영상/릴스 제작 담당)',
    label: 'Marketing Associate - 마케팅 팀 (영상/릴스 제작 담당)',
  },
  {value: 'Event Coordinator - 영사관 기획팀', label: 'Event Coordinator - 영사관 기획팀'},
  {
    value: 'Event Coordinator - 경력자 커리어 네트워크팀',
    label: 'Event Coordinator - 경력자 커리어 네트워크팀',
  },
  {value: 'Event Coordinator - 월간밋업팀', label: 'Event Coordinator - 월간밋업팀'},
]

export default function ApplyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    emailAddress: '',
    name: '',
    linkedin: '',
    firstChoice: '',
    secondChoice: '',
    motivation: '',
    strengths: '',
    coffeeChat: '',
  })

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({...prev, [name]: value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Google Forms strictly validates emails. Provide client-side validation first.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.emailAddress)) {
      setError('유효한 이메일 주소를 입력해 주세요. (예: example@gmail.com)')
      setIsSubmitting(false)
      return
    }

    const GOOGLE_FORM_URL =
      'https://docs.google.com/forms/d/e/1FAIpQLSfU6EH-EKHSEt06zGwXA04NAD82hWDImRfFVl-KcfllVp8mtg/formResponse'

    const data = new URLSearchParams()
    // Map form state to Google Form's internal entry IDs
    data.append('emailAddress', formData.emailAddress)
    data.append('entry.1890622758', formData.name)
    data.append('entry.31225970', formData.linkedin)
    data.append('entry.1732415540', formData.firstChoice)
    data.append('entry.505020402', formData.secondChoice)
    data.append('entry.246323500', formData.motivation)
    data.append('entry.1154839638', formData.strengths)
    data.append('entry.400083210', formData.coffeeChat)

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString(),
      })
      // With no-cors, we can't inspect the response, but it usually succeeds
      setIsSuccess(true)
    } catch (err: unknown) {
      console.error(err)
      setError('제출 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-success-50 text-success-800 mx-auto my-10 flex max-w-2xl flex-col items-center justify-center rounded-2xl p-8 text-center shadow-sm">
        <CheckCircle2 size={48} className="text-success mb-4" />
        <h2 className="mb-2 text-2xl font-bold">지원이 완료되었습니다!</h2>
        <p>
          2026 KDD 신입 운영진 모집에 신청해 주셔서 감사합니다.
          <br />
          꼼꼼히 검토 후 연락드리겠습니다. 🚀
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-content1 border-divider mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-2xl border p-6 shadow-sm md:p-10">
      <div className="mb-4">
        <h2 className={title({size: 'sm', className: 'mb-2 block'})}>신청서 작성</h2>
        <p className="text-default-500 mt-3 text-sm">모든 항목은 필수입니다.</p>
      </div>

      <Input
        isRequired
        type="email"
        label="이메일 주소"
        value={formData.emailAddress}
        isInvalid={formData.emailAddress !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)}
        errorMessage="유효한 이메일 주소를 입력해 주세요."
        onValueChange={(v: string) => handleChange('emailAddress', v)}
        variant="bordered"
      />

      <Input
        isRequired
        type="text"
        label="이름(영문/한글)"
        value={formData.name}
        onValueChange={(v: string) => handleChange('name', v)}
        variant="bordered"
      />

      <Textarea
        isRequired
        label="링크드인 주소 및 간단한 이력"
        value={formData.linkedin}
        onValueChange={(v: string) => handleChange('linkedin', v)}
        variant="bordered"
        minRows={3}
      />

      <Select
        isRequired
        label="1지망 포지션"
        placeholder="1지망을 선택해 주세요"
        selectedKeys={formData.firstChoice ? [formData.firstChoice] : []}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleChange('firstChoice', e.target.value)
        }
        variant="bordered">
        {POSITION_OPTIONS.map((item) => (
          <SelectItem key={item.value}>{item.label}</SelectItem>
        ))}
      </Select>

      <Select
        isRequired
        label="2지망 포지션"
        placeholder="2지망을 선택해 주세요 (1지망과 달라도 됩니다)"
        selectedKeys={formData.secondChoice ? [formData.secondChoice] : []}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleChange('secondChoice', e.target.value)
        }
        variant="bordered">
        {POSITION_OPTIONS.map((item) => (
          <SelectItem key={item.value}>{item.label}</SelectItem>
        ))}
      </Select>

      <Textarea
        isRequired
        label="지원 동기 (역할 - 이유)"
        description="KDD 운영진에 지원한 동기와 희망하는 포지션을 지원한 이유를 적어주세요."
        value={formData.motivation}
        onValueChange={(v: string) => handleChange('motivation', v)}
        variant="bordered"
        minRows={4}
      />

      <Textarea
        isRequired
        label="본인의 역량 및 강점 (역할 - 이유)"
        description="본인이 희망하는 포지션을 잘 해낼 수 있다고 생각하는 점을 적어주세요."
        value={formData.strengths}
        onValueChange={(v: string) => handleChange('strengths', v)}
        variant="bordered"
        minRows={4}
      />

      <Input
        isRequired
        type="text"
        label="3월 18-28일 중 커피챗(Zoom)이 가능한 날짜 및 시간을 모두 알려주세요"
        value={formData.coffeeChat}
        onValueChange={(v: string) => handleChange('coffeeChat', v)}
        variant="bordered"
      />

      {error && <p className="text-danger text-sm">{error}</p>}

      <Spacer y={2} />

      <Button
        type="submit"
        color="primary"
        size="lg"
        className="w-full font-bold"
        isLoading={isSubmitting}>
        지원서 제출하기
      </Button>
    </form>
  )
}
