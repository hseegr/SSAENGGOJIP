import http from './http-common'
import { SURVEY_END_POINT } from './endPoints'

export const getFacilityTypes = async (): Promise<string[]> => {
    const response = await http.get(SURVEY_END_POINT.GET_FACILITY_TYPES)
    return response.data.result.facilityTypeList
}