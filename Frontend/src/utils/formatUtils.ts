export const formatToKoreanCurrency = (value: number): string => {
    if (value >= 10000) {
        const billion = Math.floor(value / 10000);
        const million = value % 10000;
        return million === 0
            ? `${billion}억`
            : `${billion}억 ${million.toLocaleString()}`;
    }
    return `${value.toLocaleString()}`;
}