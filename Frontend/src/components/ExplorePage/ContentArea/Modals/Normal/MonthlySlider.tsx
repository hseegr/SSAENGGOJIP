import React from 'react'
import Slider from 'rc-slider'
import '@/styles/rc-slider.css'

const MonthlySlider: React.FC<{
  minMonthlyRent: number
  maxMonthlyRent: number
  setMinMonthlyRent: (value: number) => void
  setMaxMonthlyRent: (value: number) => void
}> = ({
  minMonthlyRent,
  maxMonthlyRent,
  setMinMonthlyRent,
  setMaxMonthlyRent,
}) => {
  const handleSliderChange = (value: number[]) => {
    // value는 항상 number[] 타입이어야 함
    setMinMonthlyRent(value[0])
    setMaxMonthlyRent(value[1])
  }

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numericValue = parseInt(value, 10) || 0
    if (type === 'min') {
      setMinMonthlyRent(Math.min(numericValue, maxMonthlyRent)) // 최소값은 최대값 이하로 제한
    } else {
      setMaxMonthlyRent(Math.max(numericValue, minMonthlyRent)) // 최대값은 최소값 이상으로 제한
    }
  }

  return (
    <div className="mb-6">
      <span className="block text-sm font-medium mb-2">월세</span>
      {/* 슬라이더 */}
      <Slider
        range
        min={0}
        max={200000000}
        value={[minMonthlyRent, maxMonthlyRent]} // value는 number[] 타입으로 전달
        onChange={(value) => handleSliderChange(value as number[])} // 타입 명시적으로 처리
        trackStyle={[{ backgroundColor: '#7171D7' }]}
        handleStyle={[
          { borderColor: '#7171D7', backgroundColor: '#FFFFFF' },
          { borderColor: '#7171D7', backgroundColor: '#FFFFFF' },
        ]}
      />
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>{minMonthlyRent}원</span>
        <span>
          {maxMonthlyRent === 200000000 ? '무제한' : `${maxMonthlyRent}원`}
        </span>
      </div>

      {/* 입력 및 버튼 */}
      <div className="flex items-center gap-4 mt-4">
        {/* 최소값 입력 */}
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            onClick={() => setMinMonthlyRent(Math.max(minMonthlyRent - 100, 0))} // 감소 버튼
          >
            -
          </button>
          <input
            type="number"
            value={minMonthlyRent}
            onChange={(e) => handleInputChange('min', e.target.value)}
            className="w-20 border rounded px-2 py-1 text-center"
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            onClick={() =>
              setMinMonthlyRent(Math.min(minMonthlyRent + 100, maxMonthlyRent))
            } // 증가 버튼
          >
            +
          </button>
        </div>

        <span>~</span>

        {/* 최대값 입력 */}
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            onClick={() =>
              setMaxMonthlyRent(Math.max(maxMonthlyRent - 100, minMonthlyRent))
            } // 감소 버튼
          >
            -
          </button>
          <input
            type="number"
            value={maxMonthlyRent === 10000 ? '' : maxMonthlyRent}
            onChange={(e) => handleInputChange('max', e.target.value)}
            className="w-20 border rounded px-2 py-1 text-center"
            placeholder="무제한"
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            onClick={() =>
              setMaxMonthlyRent(Math.min(maxMonthlyRent + 100, 10000))
            } // 증가 버튼
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default MonthlySlider
