// src/utils/filterUtils.ts

export interface SearchFilters {
  propertyTypes?: string[]
  dealType?: string
  MindepositPrice?: number
  MaxdepositPrice?: number
  MinmonthlyPrice?: number
  MaxmonthlyPrice?: number
  additionalFilters?: string[]
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
  if (dealType !== '') filters.dealType = dealType
  if (MindepositPrice !== 0) filters.MindepositPrice = MindepositPrice
  if (MaxdepositPrice !== 20000000) filters.MaxdepositPrice = MaxdepositPrice
  if (MinmonthlyPrice !== 0) filters.MinmonthlyPrice = MinmonthlyPrice
  if (MaxmonthlyPrice !== 20000000) filters.MaxmonthlyPrice = MaxmonthlyPrice
  if (additionalFilters.length > 0)
    filters.additionalFilters = additionalFilters

  return filters
}
