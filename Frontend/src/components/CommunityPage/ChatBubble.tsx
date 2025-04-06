import { AlertTriangle, Trash2 } from 'lucide-react'

type Props = {
  nickname: string
  content: string
  time: string
  isMe: boolean
  messageId: string
  isActive: boolean
  onDelete: (messageId: string) => void
  onReport: (messageId: string) => void
}

const ChatBubble = ({
  nickname,
  content,
  time,
  isMe,
  messageId,
  isActive,
  onDelete,
  onReport,
}: Props) => {
  return (
    // 전체 메시지 라인: 좌우 정렬을 위해 flex 사용
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      {/* 메시지 묶음 - 닉네임 + 말풍선+시간 */}
      <div className="max-w-[70%] flex flex-col gap-1">
        {/* 닉네임 */}
        <div
          className={`text-xs font-semibold ${
            isMe ? 'text-right text-gray-500 self-end' : 'text-left text-[#333]'
          }`}
        >
          {nickname}
        </div>

        {/* 말풍선 + 시간 + 아이콘 묶음 */}
        <div
          className={`flex items-end gap-1 ${
            isMe ? 'flex-row-reverse self-end' : ''
          }`}
        >
          {/* 말풍선 */}
          {/* 💬 말풍선 (삭제/신고된 경우 회색 처리) */}
          <div
            className={`px-4 py-2 text-sm rounded-xl whitespace-pre-wrap break-words ${
              isActive
                ? isMe
                  ? 'bg-[#D5D5FE] text-black'
                  : 'bg-[#F4F4F4] text-black'
                : 'bg-gray-200 text-gray-500'
            }`}
            style={{ maxWidth: '100%' }}
          >
            {content}
          </div>
          {/* 시간 + 아이콘 */}
          <div
            className={`flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap ${
              isMe ? 'flex-row-reverse' : ''
            }`}
          >
            {/* 시간 */}
            <span>{time}</span>

            {/* 아이콘 - 위치 다르게 */}
            {isMe ? (
              // 내가 보낸 메시지: 삭제 (🗑️ 왼쪽)
              <button
                onClick={() => {
                  console.log('🗑️ 삭제 클릭')
                  onDelete(messageId)
                }}
              >
                <Trash2 size={10} className="hover:text-gray-600" />
              </button>
            ) : (
              // 남이 보낸 메시지: 신고 (🚨 오른쪽)
              <button
                onClick={() => {
                  console.log('🚨 신고 클릭')
                  onReport(messageId)
                }}
              >
                <AlertTriangle size={10} className="hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBubble
