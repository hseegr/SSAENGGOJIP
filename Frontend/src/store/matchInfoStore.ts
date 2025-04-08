import { create } from 'zustand'

interface MatchInfo {
  id: number // 순차적으로 증가하는 ID (임시 ID 또는 API ID)
  address: string
  name: string
  transportMode: string
  travelTime: number
  walkTime: number
  latitude: number
  longitude: number
}

interface MatchInfoStore {
  matchInfos: MatchInfo[] // 여러 박스를 관리하는 배열
  propertyType: string[] // 공통 매물 유형 (배열)
  dealType: string // 공통 거래 유형 (단일 선택)
  addMatchInfo: (apiId?: number, initialData?: Partial<MatchInfo>) => number // 새로운 박스 추가 (API ID는 선택 사항)
  updateMatchInfo: (id: number, updatedData: Partial<MatchInfo>) => void // 특정 박스 데이터 업데이트
  togglePropertyType: (type: string) => void // 매물 유형 추가/제거
  setDealType: (type: string) => void // 거래 유형 설정
  resetMatchInfos: (newData: MatchInfo[]) => void // matchInfos 초기화
  initializeStore: () => void // 추가된 초기화 함수
}

let nextId = 1 // 임시 ID 생성을 위한 변수

const initialMatchInfos: MatchInfo[] = [] // 초기 matchInfos 상태
const initialPropertyType: string[] = [] // 초기 propertyType 상태
const initialDealType = '' // 초기 dealType 상태

const useMatchInfoStore = create<MatchInfoStore>((set) => ({
  matchInfos: [], // 초기값은 빈 배열
  propertyType: [], // 초기값은 빈 배열
  dealType: '', // 초기값은 빈 문자열

  addMatchInfo: (apiId, initialData) => {
    const newId = apiId !== undefined ? apiId : nextId++ // API ID가 없으면 임시 ID 사용
    set((state) => ({
      matchInfos: [
        ...state.matchInfos,
        {
          id: newId,
          address: initialData?.address ?? '',
          name: initialData?.name ?? '',
          transportMode: initialData?.transportMode ?? '',
          travelTime: initialData?.travelTime ?? 0,
          walkTime: initialData?.walkTime ?? 0,
          latitude: initialData?.latitude ?? 0,
          longitude: initialData?.longitude ?? 0,
        },
      ],
    }))
    return newId // 생성된 ID 반환
  },

  // 특정 박스 데이터 업데이트
  updateMatchInfo: (id, updatedData) =>
    set((state) => ({
      matchInfos: state.matchInfos.map((info) =>
        info.id === id ? { ...info, ...updatedData } : info,
      ),
    })),

  // 매물 유형 추가/제거
  togglePropertyType: (type) =>
    set((state) => ({
      propertyType: state.propertyType.includes(type)
        ? state.propertyType.filter((item) => item !== type)
        : [...state.propertyType, type],
    })),

  // 거래 유형 설정
  setDealType: (type) =>
    set(() => ({
      dealType: type,
    })),

  // matchInfos 초기화
  resetMatchInfos: (newData) =>
    set(() => ({
      matchInfos: newData,
    })),

  initializeStore: () =>
    set({
      // 초기 상태로 리셋
      matchInfos: initialMatchInfos,
      propertyType: initialPropertyType,
      dealType: initialDealType,
    }),
}))

export default useMatchInfoStore
