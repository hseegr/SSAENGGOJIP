import { create } from 'zustand'

interface PersonSurveyData {
    address: string
    placeName: string
    label: string
    transportMode: string
    travelTime: number
    walkTime: number
}

interface SurveyState {
    residentCount: number | null
    currentPersonIndex: 1 | 2
    person1: PersonSurveyData
    person2: PersonSurveyData
    selectedFacilities: string[]
    setResidentCount: (count: number) => void
    setCurrentPersonIndex: (index: 1 | 2) => void
    setPersonData: (personIndex: 1 | 2, data: Partial<PersonSurveyData>) => void
    getPersonData: (personIndex: 1 | 2) => PersonSurveyData
    setSelectedFacilities: (facilities: string[]) => void
    resetSelectedFacilities: () => void
    resetSurvey: () => void
}

const defaultPersonData: PersonSurveyData = {
    address: '',
    placeName: '',
    label: '',
    transportMode: '',
    travelTime: 0,
    walkTime: 0,
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
    residentCount: null,
    currentPersonIndex: 1,
    person1: { ...defaultPersonData },
    person2: { ...defaultPersonData },
    selectedFacilities: [],

    setResidentCount: (count) => set({ residentCount: count }),
    setCurrentPersonIndex: (index) => set({ currentPersonIndex: index }),

    setPersonData: (personIndex, data) =>
        set((state) => ({
            [`person${personIndex}`]: {
                ...state[`person${personIndex}` as 'person1' | 'person2'],
                ...data,
            },
        })),

    getPersonData: (personIndex) => {
        const state = get()
        return state[`person${personIndex}` as 'person1' | 'person2']
    },

    setSelectedFacilities: (facilities) => set({ selectedFacilities: facilities }),

    resetSelectedFacilities: () => set({ selectedFacilities: [] }),

    resetSurvey: () =>
        set({
            residentCount: null,
            currentPersonIndex: 1,
            person1: { ...defaultPersonData },
            person2: { ...defaultPersonData },
            selectedFacilities: [],
        }),
}))