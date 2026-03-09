import {Divider} from '@heroui/divider'
import {Link} from '@heroui/link'
import {ChevronLeft} from 'lucide-react'
import Image from 'next/image'
import ApplyForm from './ApplyForm'

export default function ApplyPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="container mx-auto flex max-w-7xl flex-grow flex-col items-center px-6 pt-8">
        <div className="mb-6 -ml-2 flex w-full justify-start">
          <Link
            href="/get-involved"
            className="text-default-500 hover:text-foreground flex items-center gap-1 font-medium transition-colors">
            <ChevronLeft size={18} />
            뒤로가기
          </Link>
        </div>
        <section className="mb-12">
          <div className="flex w-full flex-col items-center text-center">
            <div className="flex w-full justify-center">
              <Image
                src="/images/recruiting/recruiting_main.png"
                alt="Join Our Team"
                width={600}
                height={750}
                className="h-auto w-full max-w-xl rounded-[28px] object-contain shadow-lg"
              />
            </div>
          </div>

          <div className="text-default-700 mx-auto mt-10 mb-10 w-full max-w-xl leading-relaxed md:mt-16">
            <p className="mb-4">
              <strong>Vancouver KDD (Korean Developers & Designers)</strong>는 2017년부터 이어져 온
              밴쿠버 한인 IT 커뮤니티입니다. 개발자, 디자이너, PM, 데이터, 비즈니스 등 다양한 분야의
              사람들이 만나 서로 배우고 연결되는 공간입니다.
            </p>
            <p className="mb-4">
              2026년, KDD는 커뮤니티의 방향을 더욱 또렷하게 다듬고 더 깊이 있는 교류를 만들어가는 한
              해가 되고자 합니다.
            </p>
            <p className="mb-8">그 여정을 함께 만들어갈 운영진을 모집합니다.</p>

            <Divider className="my-14" />

            <div className="flex flex-col gap-8">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xl font-bold">
                  ✅ 이런 분을 찾습니다
                </h4>
                <ul className="text-default-600 ml-2 list-inside list-disc space-y-2">
                  <li>커뮤니티 운영에 적극적으로 기여하고 싶은 분</li>
                  <li>책임감 있게 역할을 수행할 수 있는 분</li>
                  <li>온라인/오프라인 활동에 꾸준히 참여 가능한 분</li>
                  <li>단순 참여를 넘어, 기획부터 실행까지 함께하고 싶은 분</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xl font-bold">🎁 운영진 혜택</h4>
                <ul className="text-default-600 ml-2 list-inside list-disc space-y-2">
                  <li>커뮤니티 리더십 경험</li>
                  <li>행사 기획 및 운영 경험</li>
                  <li>다양한 IT 전문가들과의 네트워킹 기회</li>
                  <li>희망 시 KDD 명의 레퍼런스 레터 제공</li>
                  <li>LinkedIn Recommendation (임기 충실 이행 시)</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xl font-bold">⏳ 운영진 임기</h4>
                <p className="text-default-600 ml-2 font-medium">
                  2026년 4월 – 2027년 12월 (약 2년)
                </p>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xl font-bold">📅 모집 일정</h4>
                <ul className="text-default-600 ml-2 list-inside list-disc space-y-1">
                  <li>
                    <strong>모집 공고:</strong> 3월 중
                  </li>
                  <li>
                    <strong>지원 마감:</strong> 3월 3주차
                  </li>
                  <li>
                    <strong>인터뷰:</strong> 3월 말
                  </li>
                  <li>
                    <strong>최종 발표:</strong> 4월 초
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xl font-bold">📝 운영 방식</h4>
                <ul className="text-default-600 ml-2 list-inside list-disc space-y-1">
                  <li>월 1회 전체 운영진 미팅 (Zoom)</li>
                  <li>월 1–2회 팀별 미팅</li>
                  <li className="text-default-500 mt-2 list-none text-sm">
                    ※ 행사 일정에 따라 추가 미팅이 있을 수 있습니다.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xl font-bold">📄 모집 절차</h4>
                <ol className="text-default-600 ml-2 list-inside list-decimal space-y-1">
                  <li>지원서 제출 (아래 양식 작성)</li>
                  <li>15–30분 인터뷰 (기존 운영진과 진행)</li>
                  <li>최종 선발 및 OT 진행</li>
                </ol>
              </div>
            </div>

            <Divider className="my-14" />

            <div className="text-center">
              <p className="text-foreground mb-4 text-lg font-medium">KDD 운영진으로 함께하며</p>
              <p className="text-foreground mb-4 text-lg font-medium">
                한인 IT 커뮤니티의 연결을 더욱 의미 있게 만들어갈 분들을 기다립니다. 🚀
              </p>
              <p className="text-default-500 flex items-center justify-center gap-1">
                <span className="text-xl">💌</span> 문의:{' '}
                <a href="mailto:vancouverkdd@gmail.com" className="text-primary hover:underline">
                  vancouverkdd@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto mb-20 w-full flex-grow">
          <ApplyForm />
        </div>
      </div>
    </div>
  )
}
