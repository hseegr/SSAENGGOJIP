import React from 'react'

const PropertyTransactionSelector: React.FC<{
  propertyTypes: string[]
  transactionTypes: string // 단일 선택
  setPropertyTypes: (types: string[]) => void
  setTransactionTypes: (type: string) => void // 단일 값 설정
}> = ({
  propertyTypes,
  transactionTypes,
  setPropertyTypes,
  setTransactionTypes,
}) => {
  const toggleSelection = (
    typeList: string[],
    setterFunction: (types: string[]) => void,
    value: string,
  ) => {
    if (typeList.includes(value)) {
      setterFunction(typeList.filter((item) => item !== value))
    } else {
      setterFunction([...typeList, value])
    }
  }

  const handleTransactionTypeClick = (type: string) => {
    // 동일한 거래 유형을 클릭하면 선택 취소
    if (transactionTypes === type) {
      setTransactionTypes('') // 선택 취소
    } else {
      setTransactionTypes(type) // 선택
    }
  }

  return (
    <div>
      {/* 매물 유형 */}
      <div className="mb-6">
        <span className="text-lg font-medium mb-2 block">매물 유형</span>
        <div className="flex items-center justify-center gap-7">
          {['아파트', '오피스텔', '빌라'].map((type) => (
            <button
              key={type}
              className={`w-[110px] h-[40px] border rounded-md flex items-center justify-center ${
                propertyTypes.includes(type)
                  ? 'bg-ssaeng-purple text-white'
                  : 'text-gray-700 border-gray-300'
              }`}
              onClick={() =>
                toggleSelection(propertyTypes, setPropertyTypes, type)
              }
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 거래 유형 */}
      <div className="mb-6">
        <span className="text-lg font-medium mb-2 block">거래 유형</span>
        <div className="flex items-center justify-center gap-7">
          {['전세', '월세', '매매'].map((type) => (
            <button
              key={type}
              className={`w-[110px] h-[40px] border rounded-md flex items-center justify-center ${
                transactionTypes === type
                  ? 'bg-ssaeng-purple text-white'
                  : 'text-gray-700 border-gray-300'
              }`}
              onClick={() => handleTransactionTypeClick(type)} // 단일 선택
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertyTransactionSelector
