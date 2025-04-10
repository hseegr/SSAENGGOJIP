import { X } from 'lucide-react'
import PropertyDetail from '@/components/common/property/PropertyDetail'
import { LikedProperty } from '@/services/propertyService'

type Props = {
    selectedProperties: LikedProperty[]
    onClose: () => void
}

const CompareModal = ({ selectedProperties, onClose }: Props) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[1200px] max-h-[90vh] rounded-xl relative flex flex-col overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
                >
                    <X size={24} />
                </button>

                <h3 className="mt-10 mb-6 text-xl font-bold text-ssaeng-purple text-center">
                    관심 매물 비교하기
                </h3>

                <div className="overflow-y-auto px-6 pb-6">
                    <div
                        className={`grid gap-6 ${selectedProperties.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                            }`}
                    >
                        {selectedProperties.map((property) => (
                            <div
                                key={property.id}
                                className="border rounded-xl shadow-sm bg-white"
                            >
                                <PropertyDetail
                                    id={property.id}
                                    latitude={property.latitude}
                                    longitude={property.longitude}
                                    onClose={() => { }}
                                    isCompareMode
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompareModal