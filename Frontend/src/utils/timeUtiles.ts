/**
 * 시간 문자열을 분 단위로 변환
 * @param timeString 시간 문자열 (예: "30분", "1시간")
 * @returns 분 단위 정수값
 */
export const convertTimeStringToMinutes = (timeString: string): number => {
  if (!timeString) return 60 // 기본값 60분

  // "1시간" 형식 처리
  if (timeString.includes('시간')) {
    const hours = parseInt(timeString.replace(/[^0-9]/g, ''))
    return hours * 60
  }

  // "30분" 형식 처리
  return parseInt(timeString.replace(/[^0-9]/g, ''))
}
