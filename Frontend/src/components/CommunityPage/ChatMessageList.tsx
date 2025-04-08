import ChatBubble from './ChatBubble'
import DateSeparator from './DateSeparator'

type Message = {
  id: string
  nickname: string
  content: string
  time: string
  isMe: boolean
  isActive: boolean
  date?: string
}

type Props = {
  messages: Message[]
  onDelete: (id: string) => void
  onReport: (id: string) => void
}

const ChatMessageList = ({ messages, onDelete, onReport }: Props) => {
  // 날짜별로 메시지 그룹화하여 렌더링
  const renderMessages = () => {
    let lastDate = ''
    const elements: JSX.Element[] = []

    messages.forEach((msg, index) => {
      // 날짜가 있고, 이전 메시지와 날짜가 다르면 구분선 추가
      if (msg.date && msg.date !== lastDate) {
        lastDate = msg.date
        elements.push(<DateSeparator key={`date-${index}`} date={msg.date} />)
      }

      // 메시지 버블 추가
      elements.push(
        <ChatBubble
          key={`${msg.id}-${index}`}
          nickname={msg.nickname}
          content={msg.content}
          time={msg.time}
          isMe={msg.isMe}
          messageId={msg.id}
          isActive={msg.isActive}
          onDelete={onDelete}
          onReport={onReport}
        />,
      )
    })

    return elements
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-6 overflow-y-auto">
      {renderMessages()}
    </div>
  )
}

export default ChatMessageList
