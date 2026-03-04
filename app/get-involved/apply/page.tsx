import { sectionTitle, subtitle, title } from '@/components/primitives'
import { Spacer } from '@heroui/spacer'
import { Link } from '@heroui/link'
import { Divider } from '@heroui/divider'
import { ChevronLeft } from 'lucide-react'
import ApplyForm from './ApplyForm'

export default function ApplyPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="container mx-auto max-w-7xl pt-8 px-6 flex-grow flex flex-col items-center">
        <div className="w-full flex justify-start mb-6 -ml-2">
          <Link href="/get-involved" className="flex items-center gap-1 text-default-500 hover:text-foreground transition-colors font-medium">
            <ChevronLeft size={18} />
            뒤로가기
          </Link>
        </div>
        <section className="mb-12">
          <div className="text-center mb-10">
            <h1 className={title({ color: 'kdd', className: 'italic pr-2' })}>🌿 KDD 2026 운영진 모집</h1>
            <Spacer y={4} />
            <h3 className={subtitle()}>
              KDD를 함께 만들어갈 새로운 운영진을 찾습니다.
            </h3>
          </div>

          <div className="bg-default-50 rounded-2xl p-6 md:p-10 mb-10 text-default-700 leading-relaxed max-w-4xl mx-auto shadow-sm">
            <p className="mb-4">
              <strong>Vancouver KDD (Korean Developers & Designers)</strong>는 2017년부터 이어져온 캐나다 서부 최고 커뮤니티입니다.<br/>
              개발자, 디자이너, PM, 데이터, 비즈니스 직군 등 다양한 분야의 분들이 만나 배우고 성장하는 커뮤니티입니다.
            </p>
            <p className="mb-8">
              2026년, KDD는 운영의 깊이를 더하고 커뮤니티의 방향성을 또렷하게 다듬어가는 해가 되고자 합니다.<br/>
              그 여정을 함께해주실 운영진을 모집합니다.
            </p>

            <Divider className="my-8" />

            <div className="flex flex-col gap-8 md:grid md:grid-cols-2">
              <div>
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">✅ 이런 분을 찾습니다</h4>
                <ul className="list-disc list-inside space-y-2 text-default-600 ml-2">
                  <li>커뮤니티 운영에 적극적으로 기여하고 싶은 분</li>
                  <li>책임감 있게 역할을 수행할 수 있는 분</li>
                  <li>온라인/오프라인 활동에 꾸준히 참여 가능한 분</li>
                  <li>단순 참여를 넘어, 기획부터 실행까지 함께하고 싶은 분</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">🎁 운영진 혜택</h4>
                <ul className="list-disc list-inside space-y-2 text-default-600 ml-2">
                  <li>커뮤니티 리더십 경험</li>
                  <li>행사 기획 및 운영 경험</li>
                  <li>다양한 IT 전문가들과의 네트워킹 기회</li>
                  <li>희망 시 KDD 명의 레퍼런스 레터 제공</li>
                  <li>LinkedIn Recommendation (임기 충실 이행 시)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">⏳ 운영진 임기</h4>
                <p className="text-default-600 ml-2 font-medium">2026년 4월 – 2027년 12월 (약 2년)</p>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">📅 모집 일정</h4>
                <ul className="list-disc list-inside space-y-1 text-default-600 ml-2">
                  <li><strong>모집 공고:</strong> 3월 중</li>
                  <li><strong>지원 마감:</strong> 3월 3주차</li>
                  <li><strong>인터뷰:</strong> 3월 말</li>
                  <li><strong>최종 발표:</strong> 4월 초</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">📝 운영 방식</h4>
                <ul className="list-disc list-inside space-y-1 text-default-600 ml-2">
                  <li>월 1회 전체 운영진 미팅 (Zoom)</li>
                  <li>월 1–2회 팀별 미팅</li>
                  <li className="list-none text-sm text-default-500 mt-2">※ 행사 일정에 따라 추가 미팅이 있을 수 있습니다.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">📄 모집 절차</h4>
                <ol className="list-decimal list-inside space-y-1 text-default-600 ml-2">
                  <li>지원서 제출 (아래 양식 작성)</li>
                  <li>15–30분 인터뷰 (기존 운영진과 진행)</li>
                  <li>최종 선발 및 OT 진행</li>
                </ol>
              </div>
            </div>

            <Divider className="my-8" />

            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-4">
                KDD 운영진으로 함께하며<br/>
                한인 IT 커뮤니티의 연결을 더욱 의미 있게 만들어갈 분들을 기다립니다. 🚀
              </p>
              <p className="text-default-500">
                📩 문의: <a href="mailto:vancouverkdd@gmail.com" className="hover:underline text-primary">vancouverkdd@gmail.com</a>
              </p>
            </div>
          </div>
        </section>

        <div className="w-full flex-grow mx-auto mb-20">
          <ApplyForm />
        </div>
      </div>
    </div>
  )
}
