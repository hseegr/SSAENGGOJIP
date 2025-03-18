import axios from "@/api/axios.ts";

const PREFIX_URL = '/common-codes'

export interface CommonCodeSummary {
    code: string;
    title: string;
    index: number;
    option: string;
}


export const getCommonCodeList = async (key: string): Promise<CommonCodeSummary[] | undefined> =>
    axios.get<CommonCodeSummary[]>(`${PREFIX_URL}?key=${key}`);

export const getCommonCodeListMap = async (keys: string[]): Promise<Map<string, CommonCodeSummary[]> | undefined> =>
    axios.get<Map<string, CommonCodeSummary[]>>(`${PREFIX_URL}?keys=${keys}`);
