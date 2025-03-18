import axios from "../axios";
import {ApiResponse} from "@/api/CommonInterface.ts";

const PREFIX_URL = '/mm/posts';

export interface PostRequest {
    channelId: string;
    message: string;
    rootId?: string;
    fileIds?: string[];
    props?: object;
    metadata?: object;
}

export interface PostUpdateRequest {
    id: string;
    isPinned?: boolean;
    message?: string;
    hasReactions?: boolean;
    props?: object;
}

export interface PostSummary {
    id: string;
    createAt: number;
    updateAt: number;
    deleteAt: number;
    editAt: number;
    userId: string;
    channelId: string;
    rootId: string;
    originalId: string;
    message: string;
    type: string;
    props: object;
    hashtag: string;
    fileIds: string[];
    pendingPostId: string;
    metadata: object;
}

export const createPost = async (body: PostRequest): Promise<ApiResponse | undefined> => axios.post<ApiResponse>(`${PREFIX_URL}`, body);
export const deletePost = async (postId: string): Promise<ApiResponse | undefined> => axios.delete<ApiResponse>(`${PREFIX_URL}/${postId}`);
export const putPost = async (body: PostUpdateRequest): Promise<ApiResponse | undefined> => axios.put<ApiResponse>(`${PREFIX_URL}/${body.id}`, body);
export const getPost = async (postId: string): Promise<PostSummary | undefined> => axios.get<PostSummary>(`${PREFIX_URL}/${postId}`);
