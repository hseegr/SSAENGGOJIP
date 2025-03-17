import axios from "@/api/axios.ts";
import {Page, Pageable} from "@/api/CommonInterface.ts";
import {UserSummarySimple} from "@/api/user/UserApi.ts";

const PREFIX_URL = '/errors'

export interface ErrorSearchRequest {
    keyword: string;
    fromDate: string;
    toDate: string;
}

export interface ErrorSummary {
    errorId: string;
    message: string;
    regUser: UserSummarySimple;
    regDatetime: string;
}

export interface ErrorDetail {
    errorId: string;
    message: string;
    stacktrace: string;
    regUser: UserSummarySimple;
    regDatetime: string;
}

export const getErrorList = async (params: ErrorSearchRequest & Pageable): Promise<Page<ErrorSummary> | undefined> =>
    axios.get<Page<ErrorSummary>>(`${PREFIX_URL}`, {params});

export const getError = async (errorId: string): Promise<ErrorDetail | undefined> =>
    axios.get<ErrorDetail>(`${PREFIX_URL}/${errorId}`);
