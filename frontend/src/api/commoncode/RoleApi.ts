import axios from "@/api/axios.ts";
import {UserSummarySimple} from "@/api/user/UserApi.ts";
import {ApiResponse, Page, Pageable} from "@/api/CommonInterface.ts";

const PREFIX_URL = '/roles'

export interface RoleSummarySimple {
    roleId: string;
    description: string;
}

export interface RoleSummaryForList {
    roleId: string;
    description: string;
    userCount: number;
    modDatetime?: string;
    modUser?: UserSummarySimple;
}

export interface RoleSummary {
    roleId: string;
    description: string;
    modDatetime?: string;
    modUser?: UserSummarySimple;
    users?: UserSummarySimple[];
}

export interface RoleSearchRequest {
    keyword: string;
}

export interface RoleRequest {
    description: string;
    userIdList?: string[];
}

export const getRoleSimpleList = async (): Promise<RoleSummarySimple[] | undefined> =>
    axios.get<RoleSummarySimple[]>(`${PREFIX_URL}?dataType=simple`);

export const getRolePage = async (params: RoleSearchRequest & Pageable): Promise<Page<RoleSummaryForList> | undefined> =>
    axios.get<Page<RoleSummaryForList>>(`${PREFIX_URL}`, {params});

export const getRoleSummary = async (roleId: string): Promise<RoleSummary | undefined> =>
    axios.get<RoleSummary>(`${PREFIX_URL}/${roleId}`);

export const saveRole = async (roleId: string, body: RoleRequest): Promise<ApiResponse | undefined> =>
    axios.put<ApiResponse>(`${PREFIX_URL}/${roleId}`, body);

export const deleteRole = async (roleId: string): Promise<ApiResponse | undefined> =>
    axios.delete<ApiResponse>(`${PREFIX_URL}/${roleId}`);
