import axios from 'axios'

// 검색 API 요청 함수
export const fetchSearchResults = async (
  query: string,
  filters: Record<string, any>,
) => {
  try {
    const response = await axios.get('/api/search', {
      params: {
        query,
        ...filters, // 필터 데이터를 병합
      }, // 검색어를 쿼리 파라미터로 전달
    })
    return response.data // 응답 데이터를 반환
  } catch (error) {
    console.error('검색 API 요청 중 오류 발생:', error)
    throw error // 에러를 호출한 곳으로 전달
  }
}
