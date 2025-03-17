import axios from "@/api/axios.ts";
import {ApiResponse, CommonCodeSummarySimple, Page, Pageable} from "@/api/CommonInterface.ts";
import {RoleSummarySimple} from "@/api/commoncode/RoleApi.ts";

const PREFIX_URL = '/users'

export interface UserSummaryForAuthentication {
    loginId: string;
    name: string;
    roles: string[];
}

export interface UserSummarySimple {
    userId: string;
    loginId: string;
    name: string;
}

export interface UserSummary {
    userId: string;
    loginId: string;
    name: string;
    roles: RoleSummarySimple[];
    regionCd?: string;
    region?: CommonCodeSummarySimple;
    disabledYn?: string;
    regUser?: UserSummarySimple;
}

export interface UserRequest {
    loginId: string;
    password?: string;
    name: string;
    regionCd: string;
    disabledYn?: string;
    roleIds: string[];
}

export interface UserSearchRequest {
    keyword: string;
    regionCd: string | null;
}

export const getDetail = async (): Promise<UserSummaryForAuthentication | undefined> =>
    axios.get<UserSummaryForAuthentication>(`${PREFIX_URL}/my-info?for=auth`, {
        customErrorHandling: true,
        shouldReject: true
    });

export const getUserPage = async (params: UserSearchRequest & Pageable): Promise<Page<UserSummary> | undefined> =>
    axios.get <Page<UserSummary>>(`${PREFIX_URL}`, {params});

export const saveUser = async (body: UserRequest): Promise<ApiResponse | undefined> =>
    axios.post<ApiResponse>(`${PREFIX_URL}`, body);

export const updateUser = async (userId: string, body: UserRequest): Promise<ApiResponse | undefined> =>
    axios.patch<ApiResponse>(`${PREFIX_URL}/${userId}`, body);
