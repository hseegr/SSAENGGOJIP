import axios from 'axios'

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY

/**
 * 주소 → 좌표 변환 (도로명 또는 지번 주소를 위도/경도로)
 * @param address 선택한 전체 주소
 * @returns 위도(y), 경도(x)
 */
export const getCoordsByAddress = async (address: string) => {
    const response = await axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
            params: { query: address },
            headers: {
                Authorization: `KakaoAK ${REST_API_KEY}`,
            },
        }
    )

    const doc = response.data.documents[0]
    return {
        latitude: doc.y,
        longitude: doc.x,
    }
}
