import {UserSummarySimple} from "@/api/user/UserApi.ts";
import {ApiResponse, Page, Pageable} from "@/api/CommonInterface.ts";
import axios from "@/api/axios.ts";

const PREFIX_URL = 'ip-allowlist'

export interface IpAllowlistSearchRequest {
    keyword: string;
}

export interface IpAllowlistRequest {
    ipAddr: string;
    description: string;
}

export interface IpAllowlistSummary {
    ipAddr: string;
    description: string;
    modUser?: UserSummarySimple;
    modDatetime?: string;
}

export const getIpAllowlistPage = async (params: IpAllowlistSearchRequest & Pageable): Promise<Page<IpAllowlistSummary> | undefined> =>
    axios.get<Page<IpAllowlistSummary>>(`${PREFIX_URL}`, {params});

export const saveIpAllowlist = async (body: IpAllowlistRequest): Promise<ApiResponse | undefined> =>
    axios.post<ApiResponse>(`${PREFIX_URL}`, body);

export const deleteIpAllowlists = async (params: URLSearchParams): Promise<ApiResponse | undefined> =>
    axios.delete<ApiResponse>(`${PREFIX_URL}`, {params});

export const updateIpAllowlist = async (body: IpAllowlistRequest): Promise<ApiResponse | undefined> =>
    axios.put<ApiResponse>(`${PREFIX_URL}`, body);
