import React, { useState } from 'react'
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode'
import { useForm } from 'react-hook-form'
import { MapPin } from 'lucide-react'

interface AddressModalProps {
  setValue: (field: string, value: string) => void
  isOpen: boolean
  onClose: () => void
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  setValue,
}) => {
  const handleComplete = (data: Address) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname) extraAddress += data.bname
      if (data.buildingName) {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName
      }
      fullAddress += extraAddress ? ` (${extraAddress})` : ''
    }
    setValue('address', fullAddress)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">주소 검색</h2>
        <DaumPostcodeEmbed onComplete={handleComplete} />
      </div>
    </div>
  )
}

interface TrafficInfoProps {
  trafficData: any // 필요에 따라 더 구체적인 타입으로 변경
}

const AddressForm: React.FC<TrafficInfoProps> = ({ trafficData }) => {
  const { setValue, watch } = useForm<{ address: string }>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="relative w-full">
      <MapPin
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        value={watch('address') || ''}
        readOnly
        className="w-full pl-10 p-2 border rounded focus:outline"
        placeholder="도착지 검색 및 교통수단 선택"
        onClick={() => setIsModalOpen(true)}
      />
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setValue={setValue}
      />
    </div>
  )
}

export default AddressForm
