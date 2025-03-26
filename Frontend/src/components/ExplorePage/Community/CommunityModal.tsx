import React, { useState } from 'react'
import ChatIcon from '@/assets/chat/Chat.svg?react'
const CommunityModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <>
      {/* 커뮤니티 버튼 */}
      {!isOpen && (
        <button
          onClick={toggleModal}
          className="fixed bottom-8 right-8 w-[70px] h-[70px] bg-[#7171D7] text-white 
                rounded-[10px] shadow-md flex flex-col items-center justify-center hover:bg-[#5a5ab3] z-[10]"
        >
          {/* SVG 아이콘 */}
          <ChatIcon className="w-6 h-6" />
          <span className="text-xs mt-1">커뮤니티</span>
        </button>
      )}

      {/* 커뮤니티 모달 */}
      {isOpen && (
        <div className="absolute bottom-[100px] right-[20px] w-[350px] h-[600px] bg-white rounded-lg shadow-lg p-4 flex flex-col z-[9999]">
          {/* 탭 메뉴와 닫기 버튼 */}
          <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
            <div className="flex">
              <button className="text-[#7171D7] font-semibold px-2 border-b-2 border-[#7171D7]">
                채팅방 검색
              </button>
              <button className="text-gray-500 hover:text-[#7171D7] px-2">
                내 채팅방
              </button>
            </div>
            <button
              onClick={toggleModal}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* 검색창 */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="지역명, 지하철역명 검색"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7171D7]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute top-1/2 right-3 w-5 h-5 transform -translate-y-1/2 text-gray-400"
            >
              <path d="M10 2a8 8 0 016.32 12.9l4.37 4.37a1 1 0 01-1.42 1.42l-4.37-4.37A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z" />
            </svg>
          </div>

          {/* 내용 영역 */}
          <div className="flex-grow bg-gray-100 rounded-md p-4 overflow-y-auto">
            <p className="text-gray-500">
              검색 결과 또는 채팅방 목록이 여기에 표시됩니다.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default CommunityModal
