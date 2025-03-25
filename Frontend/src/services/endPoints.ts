export const USER_END_POINT = {
    SOCIAL_LOGIN: (socialType: string, code: string) =>
        `/auth/login/${socialType}?code=${code}`,
}
