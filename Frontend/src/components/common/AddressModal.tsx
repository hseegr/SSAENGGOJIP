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
            <div className="bg-white p-6 rounded-xl w-[700px] max-w-[95%] relative shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-ssaeng-purple text-2xl"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    )
}

export default AddressModal
