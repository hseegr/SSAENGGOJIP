import axios from 'axios'

const http = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // refreshToken을 쿠키로 보낼 수 있게 설정
})

// 요청 인터셉터: accessToken 자동 추가
http.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

// 응답 인터셉터: accessToken 만료되었을 때 자동 재발급
http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            !originalRequest._retry // 재시도 방지 플래그
        ) {
            originalRequest._retry = true
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_APP_BASE_URL}/auth/reissue`,
                    {}, // POST 바디는 비워도 됨
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    }
                )

                const newAccessToken = res.data.result.accessToken
                localStorage.setItem('accessToken', newAccessToken)

                // 실패했던 요청 다시 보내기
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return axios(originalRequest)
            } catch (refreshError) {
                console.error('🔒 토큰 재발급 실패:', refreshError)
                // 로그아웃 처리 또는 로그인 페이지로 이동
                window.location.href = '/account/login'
            }
        }

        return Promise.reject(error)
    }
)

export default http