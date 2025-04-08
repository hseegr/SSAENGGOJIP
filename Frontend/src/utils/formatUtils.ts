export const formatToKoreanCurrency = (value: number): string => {
  if (value >= 100000000) {
    // 1억 이상인 경우
    const eok = Math.floor(value / 100000000)
    const remainder = value % 100000000

    if (remainder === 0) {
      return `${eok}억`
    }

    const man = Math.floor(remainder / 10000)
    const rest = remainder % 10000

    if (man === 0) {
      return `${eok}억`
    } else if (rest === 0) {
      return `${eok}억 ${man}만`
    } else {
      return `${eok}억 ${man}만 ${rest.toLocaleString()}`
    }
  } else if (value >= 10000) {
    // 1만 이상 1억 미만인 경우
    const man = Math.floor(value / 10000)
    const rest = value % 10000

    if (rest === 0) {
      return `${man}만`
    } else {
      return `${man}만 ${rest.toLocaleString()}`
    }
  }

  // 1만 미만인 경우
  return `${value.toLocaleString()}`
}

export const formatMaintenanceFee = (value: number): string => {
  return `${formatToKoreanCurrency(value)}`
}
