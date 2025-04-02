interface ProgressBarProps {
    step: number
}

const stepTexts = [
    '이제 시작이에요! 영차영차',
    '좋아요! 이 흐름 그대로~',
    '거의 다 왔어요! 파이팅!',
    '와 진짜 마지막!!!!',
]

const ProgressBar = ({ step }: ProgressBarProps) => {
    // step: 실제 단계 수, 예: 0~5
    // 사용자에게 보여줄 단계 (4단계 고정)
    let progressStep = 0
    if (step <= 1) progressStep = 0
    else if (step <= 2) progressStep = 1
    else if (step === 3) progressStep = 2
    else progressStep = 3

    const percent = ((step + 1) / 4) * 100

    return (
        <div className="w-full max-w-sm flex flex-col gap-2 mt-12 items-center">
            <span className="text-sm text-gray-400">{stepTexts[step]}</span>
            <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                    className="h-2 bg-ssaeng-purple rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    )
}

export default ProgressBar