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
  const typeMap: Record<string, string> = {
    원룸: 'ONEROOM',
    빌라: 'OFFICETEL',
    아파트: 'APARTMENT',
  }

  const transactionTypeMap: Record<string, string> = {
    월세: 'MONTH',
    전세: 'YEAR',
    매매: 'SALE',
  }

  const toggleSelection = (
    typeList: string[],
    setterFunction: (types: string[]) => void,
    value: string,
  ) => {
    const mappedValue = typeMap[value]

    if (!mappedValue) {
      console.error(`Invalid value: ${value}`)
      return
    }

    if (typeList.includes(mappedValue)) {
      setterFunction(typeList.filter((item) => item !== mappedValue))
    } else {
      setterFunction([...typeList, mappedValue])
    }
  }

  const handleTransactionTypeClick = (type: string) => {
    const mappedType = transactionTypeMap[type]

    if (!mappedType) {
      console.error(`Invalid transaction type: ${type}`)
      return
    }

    if (transactionTypes === mappedType) {
      setTransactionTypes('') // 선택 취소
    } else {
      setTransactionTypes(mappedType) // 선택
    }
  }

  return (
    <div>
      {/* 매물 유형 */}
      <div className="mb-6">
        <span className="text-lg font-medium mb-2 block">매물 유형</span>
        <div className="flex items-center justify-center gap-7">
          {Object.keys(typeMap).map((type) => (
            <button
              key={type}
              className={`w-[110px] h-[40px] border rounded-md flex items-center justify-center ${
                propertyTypes.includes(typeMap[type]) // 변환된 값으로 상태 확인
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
          {Object.keys(transactionTypeMap).map((type) => (
            <button
              key={type}
              className={`w-[110px] h-[40px] border rounded-md flex items-center justify-center ${
                transactionTypes === transactionTypeMap[type] // 변환된 값으로 상태 확인
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
