import React from 'react'

const CustomInfo: React.FC = () => {
  const handleBoxClick = () => {
    alert('맞춤 정보를 설정하는 창으로 이동합니다.')
  }

  return (
    <div className="mb-6">
      {/* 상단 텍스트와 버튼 */}
      <div className="flex items-center px-4 mb-4">
        <h2 className="text-lg font-bold mr-2">맞춤 정보</h2>
        <button className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
          +
        </button>
      </div>

      {/* 클릭 가능한 회색 박스 */}
      <button
        className="flex justify-center items-center w-full h-96 bg-gray-200 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-300 transition"
        onClick={handleBoxClick}
      >
        이곳을 클릭해 맞춤 정보를 설정해주세요.
      </button>
    </div>
  )
}

export default CustomInfo
