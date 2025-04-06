import React from 'react'

interface PropertyDetailProps {
    propertyId: number
    onClose: () => void
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ propertyId, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">매물 상세 정보</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                <div>
                    {/* 여기에 매물 상세 정보를 표시하는 내용을 추가하세요 */}
                    <p>매물 ID: {propertyId}</p>
                </div>
            </div>
        </div>
    )
}

export default PropertyDetail 