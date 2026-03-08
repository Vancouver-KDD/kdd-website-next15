'use client'

import Image from 'next/image'
import {
  sectionTitle,
  subtitle,
  title,
} from '@/components/primitives'
import {Accordion, AccordionItem} from '@heroui/accordion'
import {Chip} from '@heroui/chip'
import {Divider} from '@heroui/divider'
import {Link} from '@heroui/link'
import {Spacer} from '@heroui/spacer'
import {button as buttonStyles} from '@heroui/theme'
import {ArrowUpRight, Users} from 'lucide-react'

export default function GetInvolvedPage() {
  type ColorType = "default" | "primary" | "secondary" | "success" | "warning" | "danger"

  const openPositions: {
    badgeText: string,
    badgeColor: ColorType,
    role: string,
    headcount: string,
    shortDesc: string,
    summary: string,
    docLink: string
  }[] = [
    {
      badgeText: 'MARKETING Team',
      badgeColor: 'warning',
      role: 'Marketing Associate',
      headcount: '2명',
      shortDesc: 'KDD의 월간 뉴스레터를 기획·발행하고, SNS 영상 콘텐츠(릴스)를 제작합니다.',
      summary: '[주요 역할]\n- 월 1회 뉴스레터 제작\n- 월 1–2회 영상 콘텐츠(Reels) 기획 및 제작\n- KDD 행사 홍보 콘텐츠 제작\n\n[우대사항]\n- 영상 편집 툴 사용 경험 필수\n- AI 활용 콘텐츠 제작 경험 (Optional)\n- 브랜딩/마케팅에 대한 이해\n- 이메일 마케팅 경험 우대\n- 기존 제작 영상 링크 또는 포트폴리오 제출',
      docLink: '/get-involved/apply',
    },
    {
      badgeText: 'Career Networking Team',
      badgeColor: 'secondary',
      role: 'Event Coordinator',
      headcount: '1명',
      shortDesc: '경력자 대상 커리어 네트워킹 행사를 기획하고, 장소 대관부터 현장 운영까지 전반을 담당합니다.',
      summary: '[주요 역할]\n- 장소 대관 및 일정 조율\n- 커리어 네트워킹 이벤트 기획\n- 행사 셋업 및 현장 운영\n- 행사 후 정리 및 피드백 수집\n\n[우대사항]\n- KDD 커뮤니티에서 하고 싶은 방향을 1–2가지로 명확히 설명할 수 있는 분\n- 커뮤니티 활동 동기가 분명한 분\n- 실무 경력 5년 이상 선호',
      docLink: '/get-involved/apply',
    },
    {
      badgeText: 'Consulate Special Event Team',
      badgeColor: 'primary',
      role: 'Event Coordinator',
      headcount: '1명',
      shortDesc: '영사관 협업 네트워킹 및 멘토링 행사를 기획하고, 스피커 및 멘토 섭외를 담당합니다.',
      summary: '[주요 역할]\n- 네트워킹 이벤트 기획\n- 멘토링/커리어 워크샵 기획\n- 메인 스피커 및 멘토 섭외\n- 영사관 행사 내 프로그램 운영\n※ 영사관 행사 종료 후, 상의하여 타 팀 배정 예정\n\n[우대사항]\n- 네트워킹/커리어 워크샵 참여 또는 기획 경험 (Nice to have)\n- 멘토·스피커 섭외 등 대외 커뮤니케이션을 즐기는 분',
      docLink: '/get-involved/apply',
    },
    {
      badgeText: 'Monthly Meet-up Team',
      badgeColor: 'success',
      role: 'Event Coordinator',
      headcount: '1명',
      shortDesc: '매월 진행되는 월간 밋업을 기획하고 안정적으로 운영합니다.',
      summary: '[주요 역할]\n- 월간 밋업 기획\n- 행사 셋업 및 현장 운영\n- 행사 종료 후 정리\n\n[우대사항]\n- KDD 행사 참여 경험(5회 이상 우대), 디테일과 책임감, 정기 참여 가능',
      docLink: '/get-involved/apply',
    },
  ]

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-6xl flex-col">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-5xl self-start px-6 mt-12">
          <h1 className={title()}>KDD 운영진 모집</h1>
          <Spacer y={4} />
          <h3 className={subtitle({className: 'max-w-[588px]'})}>
            KDD와 함께 밴쿠버 한인 IT 커뮤니티의 성장을 이끌어갈 운영진을 모집합니다. 아래 모집 중인 포지션을 확인하고 지금 바로 지원해주세요!
          </h3>
        </section>
        
        <Spacer y={16} />
        
        <section className="mx-4 flex justify-center w-full max-w-5xl self-center px-6 md:px-0">
          <div className="w-full relative min-h-[250px] md:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/get-involved-hero.jpg" 
              alt="KDD Team" 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </section>

        <Divider orientation="horizontal" className="my-8 md:my-12 opacity-50" />

        {/* Opened Positions Section */}
        <section className="w-full px-6 py-16 md:px-[96px]">
          <div className="flex flex-col items-center">
            <h2 className={sectionTitle()}>모집 중인 포지션</h2>
            <Spacer y={12} />
          </div>

          <section id="getinvolved_accordian" className="hidden">
            <Accordion 
              variant="splitted" 
              selectionMode="multiple" 
              className="w-full"
              itemClasses={{
                base: "p-2 md:p-4 mb-4 border border-default-100 shadow-sm transition-shadow hover:shadow-md",
                title: "p-0",
                indicator: "text-default-400 rotate-0 data-[open=true]:rotate-90",
              }}
            >
              {openPositions.map((position, index) => (
                <AccordionItem 
                  key={index} 
                  aria-label={position.role} 
                  indicator={<ArrowUpRight strokeWidth={2.5} />}
                  title={
                    <div className="flex flex-col gap-2 w-full pt-1 pb-2 pl-2">
                      <div className="flex">
                        <Chip size="sm" variant="flat" color={position.badgeColor} className="font-semibold text-[11px] px-1 uppercase tracking-wider">
                          {position.badgeText}
                        </Chip>
                      </div>
                      <h4 className="flex items-center text-xl md:text-2xl font-bold mt-1 tracking-tight text-foreground">
                        {position.role}
                        <div className="flex items-center ml-3 gap-1.5 text-xs md:text-sm font-bold text-default-600 bg-default-100 px-2.5 py-1 rounded-md">
                          <Users className="w-4 h-4 text-default-500" />
                          {position.headcount}
                        </div>
                      </h4>
                      <p className="text-sm md:text-base text-default-500 font-medium line-clamp-2 md:line-clamp-1 mt-1">
                        {position.shortDesc}
                      </p>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-4 pb-4 px-2">
                    <Divider className="my-2" />
                    <p className="text-default-600 whitespace-pre-wrap leading-relaxed">{position.summary}</p>
                    <div className="pt-4">
                      <Link
                        href={position.docLink}
                        className={buttonStyles({
                          color: 'primary',
                          radius: 'sm',
                          size: 'lg',
                          className: 'w-full md:w-auto shadow-md font-bold px-10',
                        })}
                      >
                        지원하기
                      </Link>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
            {/* Marketing Associate */}
            <div className="flex flex-col items-center w-full max-w-md">
              <Link href="/get-involved/apply" className="w-full text-center group relative block overflow-hidden rounded-[20px] shadow-md cursor-pointer mb-2">
                <Image src="/images/recruiting/marketing.png" alt="Marketing Associate" width={500} height={625} className="w-full h-auto object-contain group-hover:scale-[1.05] transition-transform duration-300 ease-in-out" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    지원하기
                  </span>
                </div>
              </Link>
            </div>

            {/* Event Coordinator - Consulate */}
            <div className="flex flex-col items-center w-full max-w-md">
              <Link href="/get-involved/apply" className="w-full text-center group relative block overflow-hidden rounded-[20px] shadow-md cursor-pointer mb-2">
                <Image src="/images/recruiting/event_consulate.png" alt="Event Coordinator Consulate" width={500} height={625} className="w-full h-auto object-contain group-hover:scale-[1.05] transition-transform duration-300 ease-in-out" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    지원하기
                  </span>
                </div>
              </Link>
            </div>

            {/* Event Coordinator - Career Networking */}
            <div className="flex flex-col items-center w-full max-w-md">
              <Link href="/get-involved/apply" className="w-full text-center group relative block overflow-hidden rounded-[20px] shadow-md cursor-pointer mb-2">
                <Image src="/images/recruiting/event_career.png" alt="Event Coordinator Career" width={500} height={625} className="w-full h-auto object-contain group-hover:scale-[1.05] transition-transform duration-300 ease-in-out" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    지원하기
                  </span>
                </div>
              </Link>
            </div>

            {/* Event Coordinator - Monthly Meet-Up */}
            <div className="flex flex-col items-center w-full max-w-md">
              <Link href="/get-involved/apply" className="w-full text-center group relative block overflow-hidden rounded-[20px] shadow-md cursor-pointer mb-2">
                <Image src="/images/recruiting/event_monthly.png" alt="Event Coordinator Monthly" width={500} height={625} className="w-full h-auto object-contain group-hover:scale-[1.05] transition-transform duration-300 ease-in-out" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    지원하기
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        <Spacer className="h-20 md:h-40" />
      </div>
    </div>
  )
}
