// 날짜 구분선 컴포넌트
const DateSeparator = ({ date }: { date: string }) => {
  return (
    <div className="flex items-center my-3">
      <div className="flex-grow h-px bg-gray-100"></div>
      <div className="mx-4 text-xs text-gray-300 bg-ssaeng-gray-3 px-3 py-1 rounded-full">
        {date}
      </div>
      <div className="flex-grow h-px bg-gray-100"></div>
    </div>
  )
}

export default DateSeparator
