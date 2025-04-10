const TransportTimeBar = ({
  transportTimeList,
  totalTime,
}: {
  transportTimeList: number[]
  totalTime: number
}) => {
  const segments =
    transportTimeList.length > 0 ? transportTimeList : [totalTime]
  const segmentWidths = segments.map((time) =>
    totalTime > 0 ? `${(time / totalTime) * 100}%` : '0%',
  )

  return (
    <div className="relative w-full h-5 rounded-full overflow-hidden mt-3">
      {segmentWidths.map((width, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 h-full ${
            index === 1 ? 'bg-[#AFAFFF]' : 'bg-gray-300'
          } flex items-center justify-center text-white text-xs font-semibold`}
          style={{
            width: width,
            left:
              segmentWidths
                .slice(0, index)
                .reduce((sum, w) => sum + parseFloat(w), 0) + '%',
          }}
        >
          {segments[index]}분
        </div>
      ))}
    </div>
  )
}

export default TransportTimeBar
