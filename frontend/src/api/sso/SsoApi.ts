import axios from "@/api/axios.ts";
import {AuthenticationResponse} from "@/api/auth/AuthApi.ts";

const PREFIX_URL = '/sso'

export const getAuthorizationUri =
    async (provider: string): Promise<string | undefined> =>
        axios.get<string>(`${PREFIX_URL}/providers/${provider}/authorization-uri`);

export const ssoLogin =
    async (provider: string, code: string): Promise<AuthenticationResponse | undefined> =>
        axios.post<AuthenticationResponse>(`${PREFIX_URL}/providers/${provider}/login`, code, {headers: {"Content-Type": "text/plain"}});
