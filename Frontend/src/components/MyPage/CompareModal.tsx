import { X } from 'lucide-react'

type Props = {
    selectedIds: number[]
    onClose: () => void
}

const CompareModal = ({ selectedIds, onClose }: Props) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-[1280px] rounded-xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
                <h3 className="text-lg font-bold text-ssaeng-purple mb-6 text-center">관심 매물 비교하기</h3>

                <div className="grid grid-cols-3 gap-6">
                    {selectedIds.map((id) => (
                        <div key={id} className="border rounded-xl p-4 text-sm text-gray-700">
                            <div>🧾 매물 상세 정보</div>
                            <div className="text-xs text-gray-400 mt-2">* 실제 비교 컴포넌트로 교체 예정</div>
                            <div className="mt-2">매물 ID: {id}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CompareModal
