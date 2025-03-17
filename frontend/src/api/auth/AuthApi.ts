import axios from "@/api/axios.ts";

export interface AuthenticationRequest {
    username: string;
    password: string;
}

export interface AuthenticationResponse {
    jwt: string;
}


const PREFIX_URL = '/auth'

export const login =
    async (loginData: AuthenticationRequest): Promise<AuthenticationResponse | undefined> =>
        axios.post<AuthenticationResponse>(`${PREFIX_URL}/login`, loginData);

