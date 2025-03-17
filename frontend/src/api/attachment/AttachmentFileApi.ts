import axios from "@/api/axios.ts";

const baseUrl = import.meta.env.VITE_APP_ROOT_API;
const PREFIX_URL = '/attachment-files'

export interface AttachmentFileSummary {
    fileId: string;
    fileType: string;
    fileName: string;
    fileSize: number;
    orderIdx: number;
}

export interface UploadFileResponse {
    fileId: string;
    fileType: string;
    refId: string;
    fileName: string;
}

export const downloadAttachmentFile = (fileId: string, fileType: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const url = `${baseUrl}${PREFIX_URL}/${fileId}/types/${fileType}/download?accessToken=${localStorage.getItem("accessToken")}`;
        let iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.onload = () => {
            reject(new Error("Fail to download."));
        };
        iframe.src = url;
        setTimeout(() => {
            document.body.removeChild(iframe);
            resolve(true);
        }, 1000);
    });
}

export const uploadAttachmentFile = async (file: File, fileType: string, refId?: string): Promise<UploadFileResponse | undefined> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    return axios.post<UploadFileResponse>(`${PREFIX_URL}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: {
            refId,
            fileName: file.name,
        }
    });
}
