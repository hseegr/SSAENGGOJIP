import React from 'react'

const PropertyTransactionSelector: React.FC<{
  propertyTypes: string[]
  transactionTypes: string
  setPropertyTypes: (types: string[]) => void
  setTransactionTypes: (type: string) => void
}> = ({
  propertyTypes,
  transactionTypes,
  setPropertyTypes,
  setTransactionTypes,
}) => {
  // 매물 유형 토글 함수
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

  // 거래 유형 선택 함수
  const handleTransactionTypeClick = (type: string) => {
    if (transactionTypes === type) {
      setTransactionTypes('')
    } else {
      setTransactionTypes(type)
    }
  }

  return (
    <div>
      {/* 매물 유형 선택 */}
      <div className="mb-6">
        <span className="text-lg font-medium mb-2 block">매물 유형</span>
        <div className="flex items-center justify-center gap-7">
          {['원룸', '빌라', '아파트'].map((type) => (
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

      {/* 거래 유형 선택 */}
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
              onClick={() => handleTransactionTypeClick(type)}
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
