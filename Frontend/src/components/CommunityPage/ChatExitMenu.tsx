type Props = {
  onLeave: () => void
}

const ChatExitMenu = ({ onLeave }: Props) => {
  return (
    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
      <button
        onClick={onLeave}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        채팅방 나가기
      </button>
    </div>
  )
}

export default ChatExitMenu
