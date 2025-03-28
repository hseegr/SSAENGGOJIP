import { useRef, useEffect } from 'react'
import { Send, Lock } from 'lucide-react'

type Props = {
  input: string
  setInput: (val: string) => void
  isAnonymous: boolean
  setIsAnonymous: (val: boolean) => void
  onSend: () => void
}

const ChatInput = ({
  input,
  setInput,
  isAnonymous,
  setIsAnonymous,
  onSend,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // textarea 자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [input])

  return (
    <div className="bg-white border rounded-2xl px-4 py-3 w-full">
      {/* 텍스트입력 + 전송 버튼 */}
      <div className="flex items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
          rows={1}
          placeholder="여기를 눌러 메시지를 입력하세요"
          className="flex-1 resize-none overflow-hidden text-sm leading-5 outline-none"
        />

        {/* 전송 버튼 */}
        <button
          onClick={onSend}
          className="ml-2 text-[#7171D7] hover:opacity-80 transition"
        >
          <Send size={20} />
        </button>
      </div>

      {/* 자물쇠 아이콘 클릭 시 익명 전송 상태 토글 */}
      <div
        className="flex items-center gap-2 text-xs mt-2 cursor-pointer w-fit select-none"
        onClick={() => setIsAnonymous(!isAnonymous)}
      >
        <Lock
          size={14}
          className={`transition ${
            isAnonymous ? 'text-[#7171D7]' : 'text-gray-400'
          }`}
        />
        <span className={isAnonymous ? 'text-[#7171D7]' : 'text-gray-500'}>
          익명으로 보내기
        </span>
      </div>
    </div>
  )
}

export default ChatInput
