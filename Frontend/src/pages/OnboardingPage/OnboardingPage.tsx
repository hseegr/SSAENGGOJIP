import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import one from '@/assets/images/01.png'
import two from '@/assets/images/02.png'
import three from '@/assets/images/03.png'
import four from '@/assets/images/04.png'
import five from '@/assets/images/05.png'

// 온보딩에 표시할 슬라이드 데이터 배열 (아이콘, 제목, 설명 포함)
const onboardingSlides = [
  {
    icon: '✅',
    title: '맞춤 매물',
    description:
      '타겟 주소와 이동 시간을 설정하고,\n내 상황에 딱 맞는 매물을 추천받아보세요.',
    image: one, // ✅ 이미지 경로 추가
  },
  {
    icon: '🚆',
    title: '교통 정보',
    description:
      '도보, 지하철, 자차!\n다양한 교통 수단을 선택하고,\n한눈에 소요 시간을 확인해요. 😉',
    image: two,
  },
  {
    icon: '🏪',
    title: '주변 인프라 체크',
    description:
      '병원, 약국, 세탁소 등\n생활 편의시설 선호도를 체크하면,\n그에 맞는 매물을 우선 추천해드려요!',
    image: three,
  },
  {
    icon: '🏙️',
    title: '매물 추천',
    description:
      '현재 내 위치 주변, \n내가 선호하는 인프라를 기반으로\n딱 맞는 매물을 추천해드려요!',
    image: four,
  },
  {
    icon: '🏠',
    title: '관심 매물 비교',
    description:
      '눈에 띄는 매물을 관심 매물로 등록하고 비교해서,\n내게 더 맞는 집을 선택해보세요!',
    image: five,
  },
]

const OnboardingPage = () => {
  const navigate = useNavigate()
  // 현재 보여줄 슬라이드의 인덱스를 상태로 관리
  const [currentSlide, setCurrentSlide] = useState(0)

  // 이전 슬라이드로 이동 (첫 번째일 경우 비활성화)
  const goPrev = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1)
  }

  // 다음 슬라이드로 이동 (마지막일 경우 비활성화)
  const goNext = () => {
    if (currentSlide < onboardingSlides.length - 1)
      setCurrentSlide((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-4 mt-16">
      {/* 상단 안내 문구 + 시작하기 버튼 */}
      <div className="text-center mb-8">
        <p className="text-base">간편하게 로그인하고,</p>
        <p className="text-base font-semibold">
          <span className="font-semibold text-[#7171D7]">쌩Go집</span>의 맞춤형
          서비스를 경험해 보세요.
        </p>
        <button
          onClick={() => navigate('/main')}
          className="mt-6 px-10 py-2 rounded-full bg-gray-100 hover:bg-[#7171D7] hover:text-white text-sm transition-colors duration-200"
        >
          시작하기
        </button>
      </div>

      {/* 슬라이드 영역 전체 */}
      <div className="flex items-center justify-center gap-4">
        {/* 왼쪽 화살표 버튼 */}
        <button
          onClick={goPrev}
          disabled={currentSlide === 0}
          className="p-2 text-gray-200 hover:text-[#7171D7] disabled:opacity-30"
        >
          <ChevronLeft size={32} />
        </button>

        {/* 슬라이드 컨테이너 (가로 슬라이드 전환을 위한 transform 처리) */}
        <div className="w-[1100px] h-[380px] overflow-hidden rounded-2xl bg-white">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {onboardingSlides.map((slide, index) => (
              <div
                key={index}
                className="min-w-[1100px] px-12 py-8 flex items-center justify-between"
              >
                {/* 왼쪽: 이미지 자리 */}
                <div
                  className="overflow-hidden w-[629px] h-[328px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-ssaeng-gray-1"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 오른쪽: 텍스트 설명 */}
                <div className="text-left w-[300px]">
                  <p className="text-2xl font-semibold mb-2">
                    {slide.icon} {slide.title}
                  </p>
                  <p className="text-gray-600 whitespace-pre-line text-sm font-medium">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 화살표 버튼 */}
        <button
          onClick={goNext}
          disabled={currentSlide === onboardingSlides.length - 1}
          className="p-2 text-gray-200 hover:text-[#7171D7] disabled:opacity-30"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  )
}

export default OnboardingPage
