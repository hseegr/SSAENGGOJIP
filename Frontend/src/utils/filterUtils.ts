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
    filters.facilityTypes = additionalFilters
  }

  return filters
}
