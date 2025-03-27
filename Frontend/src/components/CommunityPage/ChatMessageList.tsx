import ChatBubble from './ChatBubble'

type Message = {
  id: number
  nickname: string
  content: string
  time: string
  isMe: boolean
}

type Props = {
  messages: Message[]
}

const ChatMessageList = ({ messages }: Props) => {
  return (
    <div className="flex flex-col gap-3 px-4 py-6 overflow-y-auto">
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          nickname={msg.nickname}
          content={msg.content}
          time={msg.time}
          isMe={msg.isMe}
        />
      ))}
    </div>
  )
}

export default ChatMessageList
