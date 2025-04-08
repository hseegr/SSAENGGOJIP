// src/mocks/mockTargetAddresses.ts

export const mockTargetAddressApiResponse = {
    isSuccess: true,
    code: 'COMMON200',
    message: '성공입니다.',
    result: [
        {
            id: 1,
            address: '서울특별시 강남구 테헤란로 212',
            name: '캠퍼스',
            isDefault: false,
            latitude: 37.501306,
            longitude: 127.039598,
            transportMode: 'SUBWAY',
            travelTime: 60,
            walkTime: 10
        },
        {
            id: 2,
            address: '서울특별시 강남구 테헤란로 212',
            name: '캠퍼스',
            isDefault: false,
            latitude: 37.501306,
            longitude: 127.039598,
            transportMode: 'SUBWAY',
            travelTime: 60,
            walkTime: 10
        }
    ]
}

// 요청에 사용할 형식으로 가공
export const mockTargetAddresses = mockTargetAddressApiResponse.result.map((item) => ({
    id: item.id,
    latitude: item.latitude,
    longitude: item.longitude,
    transportationType: item.transportMode === 'SUBWAY' ? '지하철' : item.transportMode
}))
