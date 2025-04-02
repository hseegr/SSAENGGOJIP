import http from './http-common'
import { SURVEY_END_POINT } from './endPoints'

// 타겟 주소 추가
export const addTargetAddress = async (data: {
    address: string
    name: string
    latitude: number
    longitude: number
    transportMode: string
    travelTime: number
    walkTime: number
}) => {
    const response = await http.post(SURVEY_END_POINT.ADD_TARGET_ADDRESS, data)
    return response.data.result
}

// 주변 시설 선호도 수정
export const updateFacilityPreferences = async (preferences: number[]) => {
    const response = await http.patch(SURVEY_END_POINT.UPDATE_FACILITY_PREFERENCES, {
        facilityPreferences: preferences,
    })
    return response.data.result
}

// 주변 시설 리스트 조회
export const getFacilityTypes = async (): Promise<string[]> => {
    const response = await http.get(SURVEY_END_POINT.GET_FACILITY_TYPES)
    return response.data.result.facilityTypeList
}