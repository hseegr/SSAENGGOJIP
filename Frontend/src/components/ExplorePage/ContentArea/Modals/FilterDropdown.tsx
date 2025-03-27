import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Lucide 아이콘 사용

const FilterDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림/닫힘 상태
  const [selectedOption, setSelectedOption] = useState("금액 순"); // 선택된 옵션

  const options = ["금액 순", "시간 순", "가격 비싼 순"]; // 드롭다운 옵션

  const handleOptionClick = (option: string) => {
    setSelectedOption(option); // 선택된 옵션 업데이트
    setIsOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="relative">
      {/* 드롭다운 버튼 */}
      <button
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-ssaeng-purple font-bold text-sm shadow-sm"
        onClick={() => setIsOpen(!isOpen)} // 클릭 시 열림/닫힘 토글
      >
        {selectedOption}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-md z-50">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)} // 옵션 클릭 시 실행
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterDropdown;
