interface FooterButtonsProps {
    onNext: () => void
    onSkip: () => void
    onBack?: () => void
    isNextDisabled?: boolean
    isFirstStep?: boolean // Step1인 경우 true
    isCompleteStep?: boolean // 마지막 단계 여부
}

const FooterButtons = ({
    onNext,
    onSkip,
    onBack,
    isNextDisabled = false,
    isFirstStep = false,
    isCompleteStep = false,
}: FooterButtonsProps) => {
    return (
        <div className="flex flex-col items-center gap-6 mt-16 w-full max-w-md">
            {/* 버튼 영역 */}
            <div className="flex justify-center w-full gap-32">
                {isFirstStep ? (
                    // 빈 공간을 차지하는 투명한 버튼 (기능 없음)
                    <div className="w-28" />
                ) : (
                    <button
                        className="w-28 py-2 rounded-full bg-gray-300 text-white text-sm font-medium hover:bg-gray-400"
                        onClick={onBack}
                    >
                        이전
                    </button>
                )}

                <button
                    className={`w-28 py-2 rounded-full text-white text-sm font-medium transition-all
        ${isNextDisabled
                            ? 'bg-gray-300 cursor-not-allowed'
                            : isCompleteStep
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-ssaeng-purple hover:bg-[#5f5fc7]'}`}
                    disabled={isNextDisabled}
                    onClick={onNext}
                >
                    {isCompleteStep ? '완료' : '다음'}
                </button>
            </div>

            {/* 나중에 설정할게요 */}
            <button
                className="text-sm text-gray-400 underline hover:text-gray-500 mt-24 mb-30"
                onClick={onSkip}
            >
                나중에 설정할게요
            </button>
        </div>
    )
}

export default FooterButtons
