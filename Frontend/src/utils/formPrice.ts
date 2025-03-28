// src/utils/formatPrice.ts
export const formatPrice = (price: number): string => {
    if (price >= 100000000) {
      const billion = Math.floor(price / 100000000); // 억 단위 계산
      const tenMillion = Math.floor((price % 100000000) / 10000); // 천만 단위 계산
      if (tenMillion === 0){
        return `${billion}억`;
      } else{
      return `${billion}억 ${tenMillion}`;}
    } else {
      const tenMillion = Math.floor(price / 10000); // 천만 단위 계산
      return `${tenMillion}`;
    }
  };
  