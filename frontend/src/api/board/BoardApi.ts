import axios from "@/api/axios.ts";
import {ApiResponse, Page, Pageable} from "@/api/CommonInterface.ts";
import {UserSummarySimple} from "@/api/user/UserApi.ts";
import {AttachmentFileSummary} from "@/api/attachment/AttachmentFileApi.ts";

const prefixUrl = (bbsId: string) => `/bbs/${bbsId}/boards`;

export interface BoardSearchRequest {
    keyword?: string;
}

export interface BoardRequest {
    title: string;
    content: string;
    upperBoardId?: string;
    attachmentFileIds: string[];
}

export interface BoardSummaryForList {
    boardId: string;
    title: string;
    modUser?: UserSummarySimple;
    modDatetime?: string;
}

export interface BoardSummary {
    boardId: string;
    bbsId: string;
    title: string;
    content: string;
    upperBoardId: string;
    modUser?: UserSummarySimple;
    modDatetime?: string;
    attachmentFiles: AttachmentFileSummary[];
}

export const getBoard = async (bbsId: string, boardId: string): Promise<BoardSummary | undefined> =>
    axios.get<BoardSummary>(`${prefixUrl(bbsId)}/${boardId}`);

export const getBoardPage = async (bbsId: string, params: BoardSearchRequest & Pageable): Promise<Page<BoardSummaryForList> | undefined> =>
    axios.get <Page<BoardSummaryForList>>(`${prefixUrl(bbsId)}`, {params});

export const saveBoard = async (bbsId: string, body: BoardRequest): Promise<ApiResponse | undefined> =>
    axios.post<ApiResponse>(`${prefixUrl(bbsId)}`, body);

export const updateBoard = async (bbsId: string, boardId: string, body: BoardRequest): Promise<ApiResponse | undefined> =>
    axios.patch<ApiResponse>(`${prefixUrl(bbsId)}/${boardId}`, body);
