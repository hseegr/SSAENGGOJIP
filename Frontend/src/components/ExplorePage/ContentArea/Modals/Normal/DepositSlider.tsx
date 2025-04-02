import React from 'react'
import Slider from 'rc-slider'
import '@/styles/rc-slider.css'

const DepositSlider: React.FC<{
  minDeposit: number
  maxDeposit: number
  setMinDeposit: (value: number) => void
  setMaxDeposit: (value: number) => void
}> = ({ minDeposit, maxDeposit, setMinDeposit, setMaxDeposit }) => {
  const handleSliderChange = (value: number[]) => {
    // value는 항상 number[] 타입이어야 함
    setMinDeposit(value[0])
    setMaxDeposit(value[1])
  }

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numericValue = parseInt(value, 10) || 0
    if (type === 'min') {
      setMinDeposit(Math.min(numericValue, maxDeposit)) // 최소값은 최대값 이하로 제한
    } else {
      setMaxDeposit(Math.max(numericValue, minDeposit)) // 최대값은 최소값 이상으로 제한
    }
  }

  return (
    <div className="mb-6">
      <span className="block text-sm font-medium mb-2">보증금 (전세금)</span>
      {/* 슬라이더 */}
      <Slider
        range
        min={0}
        max={200000000}
        value={[minDeposit, maxDeposit]} // value는 number[] 타입으로 전달
        onChange={(value) => handleSliderChange(value as number[])} // 타입 명시적으로 처리
        trackStyle={[{ backgroundColor: '#7171D7' }]}
        handleStyle={[
          { borderColor: '#7171D7', backgroundColor: '#FFFFFF' },
          { borderColor: '#7171D7', backgroundColor: '#FFFFFF' },
        ]}
      />
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>{minDeposit}원</span>
        <span>{maxDeposit === 200000000 ? '무제한' : `${maxDeposit}원`}</span>
      </div>

      {/* 입력 및 버튼 */}
      <div className="flex items-center gap-4 mt-4">
        {/* 최소값 입력 */}
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            onClick={() => setMinDeposit(Math.max(minDeposit - 100, 0))} // 감소 버튼
          >
            -
          </button>
          <input
            type="number"
            value={minDeposit}
            onChange={(e) => handleInputChange('min', e.target.value)}
            className="w-20 border rounded px-2 py-1 text-center"
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            onClick={() =>
              setMinDeposit(Math.min(minDeposit + 100, maxDeposit))
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
              setMaxDeposit(Math.max(maxDeposit - 100, minDeposit))
            } // 감소 버튼
          >
            -
          </button>
          <input
            type="number"
            value={maxDeposit === 10000 ? '' : maxDeposit}
            onChange={(e) => handleInputChange('max', e.target.value)}
            className="w-20 border rounded px-2 py-1 text-center"
            placeholder="무제한"
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            onClick={() => setMaxDeposit(Math.min(maxDeposit + 100, 10000))} // 증가 버튼
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default DepositSlider
