import { useState } from 'react'

const mockData = [
    { label: '병원', value: 100 },
    { label: '약국', value: 100 },
    { label: '대형 마트', value: 100 },
    { label: '편의점', value: 100 },
    { label: '동물 병원', value: 100 },
    { label: '세탁소', value: 100 },
    { label: '공원', value: 100 },
    { label: '관공서', value: 100 },
];

// 퍼센트에 따라 왼쪽 채워진 색상과 오른쪽 색상을 나누기 위한 gradient 생성
const getSliderStyle = (value: number) => ({
    background: `linear-gradient(to right, #8779f8 ${value}%, #e3e0fa ${value}%)`
})

const PreferencesTab = () => {
    const [preferences, setPreferences] = useState(mockData.map(item => item.value))

    const handleSliderChange = (index: number, newValue: number) => {
        const updated = [...preferences]
        updated[index] = newValue
        setPreferences(updated)
    }

    return (
        <div className="p-10 w-full h-[calc(100vh-120px)]">
            <h2 className="text-2xl font-bold text-ssaeng-purple mb-8">내 생활권 선호도 설정</h2>
            <div className="space-y-6 overflow-y-auto">
                {mockData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between w-full max-w-[640px] border-b border-gray-100 pb-4">
                        <span className="w-24 text-base font-semibold">{item.label}</span>
                        {/* 슬라이더 */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={preferences[idx]}
                            onChange={(e) => handleSliderChange(idx, Number(e.target.value))}
                            style={getSliderStyle(preferences[idx])}
                            className="w-[310px] accent-ssaeng-purple
                                appearance-none h-2 rounded-full bg-ssaeng-purple-light
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:h-4
                                [&::-webkit-slider-thumb]:w-4
                                [&::-webkit-slider-thumb]:rounded-full
                                [&::-webkit-slider-thumb]:bg-ssaeng-purple"
                        />

                        {/* 숫자 입력 필드 + % 텍스트 */}
                        <div className="flex items-center gap-1 ml-6">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={preferences[idx]}
                                onChange={(e) => {
                                    const val = Number(e.target.value)
                                    if (val >= 0 && val <= 100) {
                                        handleSliderChange(idx, val)
                                    }
                                }}
                                className="w-14 h-6 text-sm text-ssaeng-purple text-right 
             outline-none bg-white border border-gray-300 rounded 
             focus:ring-1 focus:ring-ssaeng-purple focus:border-ssaeng-purple"
                            />
                            <span className="text-sm ml-2 text-ssaeng-purple">%</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-8 mt-10 pr-12">
                <button
                    className="bg-gray-200 text-gray-400 font-medium text-sm w-32 px-6 py-2 rounded-md"
                    onClick={() => setPreferences(mockData.map(item => item.value))}
                >
                    초기화
                </button>
                <button
                    className="bg-ssaeng-purple text-white font-medium text-sm w-32 px-6 py-2 rounded-md"
                    onClick={() => console.log('저장할 값:', preferences)}
                >
                    저장
                </button>
            </div>
        </div>
    )
}

export default PreferencesTab
