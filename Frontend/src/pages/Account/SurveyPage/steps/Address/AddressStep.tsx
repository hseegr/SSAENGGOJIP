import { useEffect, useState } from 'react'
import ProgressBar from '@/components/SurveyPage/ProgressBar'
import QuestionBox from '@/components/SurveyPage/QuestionBox'
import FooterButtons from '@/components/SurveyPage/FooterButtons'
import { useSurveyStore } from '@/store/surveyStore'
import { MapPin } from 'lucide-react'
import AddressModal from '@/components/common/AddressModal'
import DaumPostcode from 'react-daum-postcode'
import { getCoordsByAddress } from '@/services/locationService'

interface AddressStepProps {
    onNext: () => void
    onBack: () => void
    onSkip: () => void
}

const AddressStep = ({ onNext, onBack, onSkip }: AddressStepProps) => {
    const {
        currentPersonIndex,
        residentCount,
        person1,
        person2,
        setPersonData,
    } = useSurveyStore()

    const personData = currentPersonIndex === 1 ? person1 : person2

    const [selected, setSelected] = useState<{
        address: string
        latitude: string
        longitude: string
    } | null>(null)

    const [showPostcode, setShowPostcode] = useState(false)

    useEffect(() => {
        const { address, latitude, longitude } = personData;

        if (!address || !latitude || !longitude) return;

        if (
            selected?.address !== address ||
            selected?.latitude !== latitude ||
            selected?.longitude !== longitude
        ) {
            setSelected({ address, latitude, longitude });
        }
        // selected도 의존성 배열에 추가해야 정확하게 비교 가능
    }, [personData, selected]);

    const handleComplete = async (data: any) => {
        const fullAddress = data.roadAddress || data.address
        try {
            const { latitude, longitude } = await getCoordsByAddress(fullAddress)
            setSelected({ address: fullAddress, latitude, longitude })

            setPersonData(currentPersonIndex, {
                address: fullAddress,
                placeName: data.buildingName || '',
                latitude,
                longitude,
            })

            setShowPostcode(false)
        } catch (error) {
            console.error('좌표 변환 실패:', error)
        }
    }

    return (
        <div className="flex flex-col justify-between items-center text-center min-h-screen w-full px-4 py-8">
            <div className="w-full flex justify-center mb-4">
                <ProgressBar step={1} />
            </div>

            <div className="flex flex-col items-center gap-y-6">
                <div className="mt-6">
                    <QuestionBox>
                        {residentCount === 2 && (
                            <span className="text-ssaeng-purple font-bold">
                                {currentPersonIndex === 1 ? '첫 번째' : '두 번째'} 사람의{' '}
                            </span>
                        )}
                        현재 <span className="font-bold">직장/학교 위치</span>가 어디인가요?
                        <br />
                        맞춤 검색을 진행하는 데에 꼭 필요한 정보예요!
                    </QuestionBox>
                </div>

                <button
                    onClick={() => setShowPostcode(true)}
                    className="w-80 py-2 px-4 border border-ssaeng-purple text-ssaeng-purple rounded-md text-sm font-medium hover:bg-ssaeng-purple-light transition"
                >
                    주소 검색하기
                </button>

                <AddressModal isOpen={showPostcode} onClose={() => setShowPostcode(false)}>
                    <DaumPostcode onComplete={handleComplete} />
                </AddressModal>

                {selected && (
                    <div className="w-80 p-4 bg-gray-100 rounded text-left">
                        <div className="flex gap-2 items-start">
                            <MapPin className="mt-0.5 w-4 h-4 text-ssaeng-purple" />
                            <p className="text-sm">
                                <span className="font-semibold">{selected.address}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto w-full flex justify-center">
                <FooterButtons
                    onNext={onNext}
                    onBack={onBack}
                    onSkip={onSkip}
                    isNextDisabled={!selected}
                />
            </div>
        </div>
    )
}

export default AddressStep