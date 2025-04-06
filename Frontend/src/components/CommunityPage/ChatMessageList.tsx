import ChatBubble from './ChatBubble'

type Message = {
  id: string
  nickname: string
  content: string
  time: string
  isMe: boolean
  isActive: boolean
}

type Props = {
  messages: Message[]
  onDelete: (id: string) => void
  onReport: (id: string) => void
}

const ChatMessageList = ({ messages, onDelete, onReport }: Props) => {
  return (
    <div className="flex flex-col gap-3 px-4 py-6 overflow-y-auto">
      {messages.map((msg, index) => (
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
        />
      ))}
    </div>
  )
}

export default ChatMessageList
