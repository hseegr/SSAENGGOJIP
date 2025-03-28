import { create } from 'zustand'

interface SurveyState {
    residentCount: number | null
    workAddress: string
    workLabel: string
    setResidentCount: (count: number) => void
    setWorkAddress: (address: string) => void
    setWorkLabel: (label: string) => void
}

export const useSurveyStore = create<SurveyState>((set) => ({
    residentCount: null,
    workAddress: '',
    workLabel: '',
    setResidentCount: (count) => set({ residentCount: count }),
    setWorkAddress: (address) => set({ workAddress: address }),
    setWorkLabel: (label) => set({ workLabel: label }),
}))
