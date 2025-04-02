import { ReactNode } from 'react'

interface AddressModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

const AddressModal = ({ isOpen, onClose, children }: AddressModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 pt-12 rounded-xl w-[600px] max-w-[95%] h-[480px] relative shadow-xl">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-ssaeng-purple text-2xl"
                >
                    ✕
                </button>

                {/* 검색창을 아래로 내리기 위해 padding-top을 줌 */}
                <div className="mt-2 h-full overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AddressModal
