type Props = {
  input: string // 현재 입력창에 입력 중인 값
  setInput: (val: string) => void // 입력값 변경 시 상태를 업데이트할 함수
  isAnonymous: boolean // 익명 전송 여부
  setIsAnonymous: (val: boolean) => void // 익명 체크 상태 변경 함수
  onSend: () => void // 전송 버튼 클릭 또는 Enter 시 실행할 함수
}

const ChatInput = ({
  input,
  setInput,
  isAnonymous,
  setIsAnonymous,
  onSend,
}: Props) => {
  return (
    // 입력창 전체 컨테이너
    <div className="flex flex-col py-3 gap-2">
      {/* 입력창 + 전송 버튼 */}
      <div className="flex items-center gap-2">
        {/* 입력 필드 */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)} // 입력 변경 시 상태 업데이트
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend() // Enter 키로 전송 가능
          }}
          className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring"
          placeholder="메시지를 입력하세요"
        />

        {/* 전송 버튼 */}
        <button
          onClick={onSend}
          className="text-blue-500 hover:text-blue-700 font-semibold"
        >
          ➤
        </button>
      </div>

      {/* 익명으로 보내기 체크박스 */}
      <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)} // 체크 상태 변경 시 업데이트
        />
        익명으로 보내기
      </label>
    </div>
  )
}

export default ChatInput
