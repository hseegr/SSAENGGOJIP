import http from './http-common'
import { MATCH_SEARCH_TARGET_END_POINT } from './endPoints'

// 타겟 주소 추가할때 사용
interface TargetInfo {
  address: string
  name: string
  latitude: number
  longtitude: number
  tranportMode: string
  travelTime: number
  walkTime: number
}

// 타겟 주소 수정할때 사용
interface EditTarget {
  address?: string
  name?: string
  latitude?: number
  longtitude?: number
  tranportMode?: string
  travelTime?: number
  walkTime?: number
}

// 타겟 주소 조회 - GET
export const getTargetAddress = async () => {
  try {
    const response = await http.get(MATCH_SEARCH_TARGET_END_POINT.GET_TARGET)
    console.log(response.data)
    return response.data.result
  } catch (error) {
    console.error('검색 요청 중 오류발생:', error)
    throw error
  }
}

// 타겟 주소 추가 - POST
export const addTargetAddress = async (targetInfo: TargetInfo) => {
  try {
    const response = await http.post(
      MATCH_SEARCH_TARGET_END_POINT.ADD_TARGET,
      targetInfo,
    )
    console.log(response.data)
    return
  } catch (error) {
    console.error('추가중 오류발생:', error)
    throw error
  }
}
// 타겟 주소 수정 - PATCH
export const editTargetAddress = async (
  editTarget: EditTarget,
  targetAddressId: number,
) => {
  try {
    const response = await http.patch(
      MATCH_SEARCH_TARGET_END_POINT.EDIT_TARGET(targetAddressId),
      editTarget,
    )
    console.log(response.data)
    return
  } catch (error) {
    console.error('데이터 수정 중 오류발생:', error)
    throw error
  }
}
// 타겟 주소 삭제 - DELETE
export const deleteTargetAddress = async (targetAddressId: number) => {
  try {
    const response = await http.delete(
      MATCH_SEARCH_TARGET_END_POINT.DELETE_TARGET(targetAddressId),
    )
    console.log(response.data)
  } catch (error) {
    console.error('데이터 삭제 중 오류발생:', error)
    throw error
  }
}
