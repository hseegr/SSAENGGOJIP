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
    const percent = ((step + 1) / 4) * 100

    return (
        <div className="w-full max-w-sm flex flex-col gap-2 items-center">
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