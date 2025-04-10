import { useState } from 'react'
import ReactDOM from 'react-dom'
import PropertyFilterStep from './PropertyFilterStep'
import FacilityFilterStep from './FacilityFilterStep'
import { X } from 'lucide-react'
import useFilterStore from '@/store/filterStore'
import { fetchNormalSearchResults } from '@/services/propertyService'
import { buildSearchFilters } from '@/utils/filterUtils'
import { toast } from 'react-toastify' // ✅ 추가
import 'rc-slider/assets/index.css'

interface NormalSearchFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (results: any) => void
  searchQuery: string
}

const NormalSearchFilterModal = ({
  isOpen,
  onClose,
  onComplete,
  searchQuery,
}: NormalSearchFilterModalProps) => {
  const [step, setStep] = useState(1)
  const {
    resetAllFilters,
    propertyTypes,
    dealType,
    MindepositPrice,
    MaxdepositPrice,
    MinmonthlyPrice,
    MaxmonthlyPrice,
    additionalFilters,
  } = useFilterStore()

  if (!isOpen) return null

  const handleClose = () => {
    resetAllFilters()
    setStep(1)
    onClose()
  }

  const handleComplete = async () => {
    try {
      const filters = buildSearchFilters({
        propertyTypes,
        dealType,
        MindepositPrice,
        MaxdepositPrice,
        MinmonthlyPrice,
        MaxmonthlyPrice,
        additionalFilters,
      })

      const result = await fetchNormalSearchResults(searchQuery.trim(), filters)
      onComplete(result)
    } catch (error: any) {
      if (error.response?.data?.code === 'PROPERTY4013') {
        toast.warning(
          '검색 결과가 너무 많아요! 조건을 조금 더 구체적으로 설정해 주세요.',
          {
            style: {
              width: '700px',
            },
          },
        )
      } else {
        console.error('필터 검색 실패:', error)
      }
      onComplete({ total: 0, properties: [] })
    }

    handleClose()
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] max-w-md max-h-[90vh] overflow-y-auto p-6">
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-xl"
          onClick={handleClose}
        >
          <X />
        </button>

        {step === 1 && (
          <PropertyFilterStep
            onNext={() => setStep(2)}
            currentStep={step}
            totalStep={2}
          />
        )}
        {step === 2 && (
          <FacilityFilterStep
            onBack={() => setStep(1)}
            onComplete={handleComplete}
            currentStep={step}
            totalStep={2}
          />
        )}
      </div>
    </div>,
    document.body,
  )
}

export default NormalSearchFilterModal
