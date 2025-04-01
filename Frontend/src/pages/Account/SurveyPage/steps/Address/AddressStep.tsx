import { useEffect, useState } from 'react'
import ProgressBar from '@/components/SurveyPage/ProgressBar'
import QuestionBox from '@/components/SurveyPage/QuestionBox'
import FooterButtons from '@/components/SurveyPage/FooterButtons'
import { useSurveyStore } from '@/store/surveyStore'
import { Search, MapPin } from 'lucide-react'
import { mockAddressList } from '@/mocks/mockAddress'

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

    const [input, setInput] = useState('')
    const [results, setResults] = useState<typeof mockAddressList>([])
    const [selected, setSelected] = useState<{
        name: string
        address: string
    } | null>(null)

    useEffect(() => {
        // 기존 정보가 있다면 초기 선택 상태로 반영
        if (personData.address && personData.placeName) {
            setSelected({ name: personData.placeName, address: personData.address })
        }
    }, [personData])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInput(value)

        if (value.length >= 1) {
            const filtered = mockAddressList.filter((item) =>
                item.name.includes(value)
            )
            setResults(filtered)
        } else {
            setResults([])
        }
    }

    const handleSelect = (item: { name: string; address: string }) => {
        setSelected(item)
        setResults([])
        setInput('')

        setPersonData(currentPersonIndex, {
            placeName: item.name,
            address: item.address,
        })
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
                            <>
                                <span className="text-ssaeng-purple font-bold">
                                    {currentPersonIndex === 1 ? '첫 번째' : '두 번째'} 사람의{' '}
                                </span>
                            </>
                        )}
                        현재 <span className="font-bold">직장/학교 위치</span>가 어디인가요?
                        <br />
                        맞춤 검색을 진행하는 데에 꼭 필요한 정보예요!
                    </QuestionBox>
                </div>

                <div className="relative w-80 mt-6">
                    <input
                        type="text"
                        placeholder="주소를 입력해 주세요.."
                        value={input}
                        onChange={handleInput}
                        className="w-full border border-ssaeng-purple rounded-md py-2 px-4 text-sm focus:outline-none"
                    />
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-ssaeng-purple" />

                    {results.length > 0 && (
                        <ul className="absolute z-10 w-full mt-2 border border-ssaeng-purple rounded-md bg-white shadow-sm">
                            {results.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(item)}
                                    className="p-2 text-left text-sm hover:bg-ssaeng-purple/10 cursor-pointer border-b last:border-b-0"
                                >
                                    <span className="font-semibold">{item.name}</span>
                                    <br />
                                    <span className="text-xs text-gray-500">{item.address}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selected && (
                    <div className="w-80 p-4 bg-gray-100 rounded text-left">
                        <div className="flex gap-2 items-start">
                            <MapPin className="mt-0.5 w-4 h-4 text-ssaeng-purple" />
                            <p className="text-sm">
                                <span className="font-semibold">{selected.name}</span>
                                <br />
                                {selected.address}
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