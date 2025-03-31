import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">맞춤 정보 설정</h2>
        <p className="text-gray-600 mb-6">
          여기서 맞춤 정보를 설정할 수 있습니다.
        </p>
        <button
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default Modal
