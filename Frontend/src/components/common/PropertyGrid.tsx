import PropertyCard from './PropertyCard'

type Property = {
    id: number
    isRecommend: boolean
    propertyType: string
    dealType: string
    price: number
    rentPrice: number
    maintenancePrice: number
    totalFloor: number
    floor: number
    area: number
    address: string
    imageUrl?: string
    isInterest: boolean
}

type Props = {
    properties?: Property[]
    columns?: number
    isCompareMode?: boolean
    selectedIds?: number[]
    onSelect?: (id: number) => void
}

const PropertyGrid = ({
    properties = [], // ✅ 기본값 추가
    columns = 4,
    isCompareMode = false,
    selectedIds = [],
    onSelect,
}: Props) => {
    const columnClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
    }[columns] || 'grid-cols-4'

    return (
        <div className={`grid ${columnClass} gap-4`}>
            {Array.isArray(properties) &&
                properties.map((item) => (
                    <PropertyCard
                        key={item.id}
                        property={item}
                        isCompareMode={isCompareMode}
                        isSelected={selectedIds?.includes(item.id)}
                        onSelect={() => onSelect?.(item.id)}
                    />
                ))}
        </div>
    )
}

export default PropertyGrid