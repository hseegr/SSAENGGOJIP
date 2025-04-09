// src/utils/filterUtils.ts

const DEPOSIT_MAX = 2_050_000_000
const MONTHLY_MAX = 4_100_000

export interface SearchFilters {
  search?: string
  propertyTypes?: string[]
  dealType?: string
  minPrice?: number // 전세/보증금
  maxPrice?: number
  minRentPrice?: number // 월세
  maxRentPrice?: number
  facilityTypes?: string[]
}

export const buildSearchFilters = ({
  propertyTypes,
  dealType,
  MindepositPrice,
  MaxdepositPrice,
  MinmonthlyPrice,
  MaxmonthlyPrice,
  additionalFilters,
}: {
  propertyTypes: string[]
  dealType: string
  MindepositPrice: number
  MaxdepositPrice: number
  MinmonthlyPrice: number
  MaxmonthlyPrice: number
  additionalFilters: string[]
}): SearchFilters => {
  const filters: SearchFilters = {}

  if (propertyTypes.length > 0) filters.propertyTypes = propertyTypes
  if (dealType) filters.dealType = dealType
  if (MindepositPrice > 0) filters.minPrice = MindepositPrice
  if (MaxdepositPrice < DEPOSIT_MAX) filters.maxPrice = MaxdepositPrice
  if (MinmonthlyPrice > 0) filters.minRentPrice = MinmonthlyPrice
  if (MaxmonthlyPrice < MONTHLY_MAX) filters.maxRentPrice = MaxmonthlyPrice
  if (additionalFilters.length > 0) {
    filters.facilityTypes = additionalFilters.map(nameToEnum)
  }

  return filters
}

const nameToEnum = (name: string): string => {
  const map: Record<string, string> = {
    '편의점': 'CONVENIENT',
    '병원': 'HOSPITAL',
    '약국': 'PHARMACY',
    '공원': 'PARK',
    '관공서': 'PUBLIC',
    '동물 병원': 'VET',
    '대형 마트': 'MART',
    '세탁소': 'LAUNDRY',
  }
  return map[name] ?? name
}
