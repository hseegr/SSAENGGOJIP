import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {useCommonDialog} from "@/store/commonDialog.ts";
import {Pinia} from "pinia";
import {useCommonStore} from "@/store/common.ts";

let baseURL = import.meta.env.VITE_APP_ROOT_API;

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    customLoading?: boolean;
    customErrorHandling?: boolean;
    shouldReject?: boolean;
}

declare module 'axios' {
    interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig {
        headers: AxiosRequestHeaders;
        customLoading?: boolean;
        customErrorHandling?: boolean;
        shouldReject?: boolean;
    }
}


const initInterceptors = (pinia: Pinia) => {
    const commonDialog = useCommonDialog(pinia);
    const commonStore = useCommonStore(pinia);
    instance.interceptors.request.use(
        config => {
            if (!config.customLoading) {
                commonStore.startLoading();
            }

            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            if (!error.config.customLoading) {
                commonStore.endLoading();
            }
            return Promise.reject(error);
        })

    instance.interceptors.response.use(
        response => {
            if (!response.config.customLoading) {
                commonStore.endLoading();
            }
            return response;
        },
        async error => {
            if (!error.config.customLoading) {
                commonStore.endLoading();
            }
            console.log(error);
            if (!error.config.customErrorHandling) {
                if (error.response) {
                    if (error.response.status === 404) {
                        await commonDialog.showCommonDialog({
                            title: 'Not Found Error',
                            message: `${error.message}\n${error.response.data.detail}`,
                            type: 'error',
                        });
                    } else if (error.response.status === 403) {
                        await commonDialog.showCommonDialog({
                            title: 'Forbidden Error',
                            message: `${error.message}\n${error.response.data}`,
                            type: 'error',
                        });
                    } else {
                        await commonDialog.showCommonDialog({
                            title: 'Unknown Error',
                            message: `${error.message}\n${error.response.data.message || error.response.data || error.response.statusText}`,
                            type: 'error',
                        });
                    }
                } else if (error.message) {
                    await commonDialog.showCommonDialog({
                        title: 'Network Error',
                        message: `서버로부터 응답을 받는데 실패하였습니다.\n${error.message}`,
                        type: 'error',
                    });
                } else {
                    await commonDialog.showCommonDialog({
                        title: 'Unknown Error',
                        message: `${JSON.stringify(error.response.data)}`,
                        type: 'error',
                    });
                }
            }
            if (error.config.shouldReject) {
                return Promise.reject(error);
            } else {
                return Promise.resolve();
            }
        });
}

const instance = axios.create({
    baseURL: baseURL,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
})


const request = async <T>(config: AxiosRequestConfig): Promise<T | undefined> => {
    const response: AxiosResponse<T> = await instance.request(config);
    return response ? response.data : undefined;
};
const get = async <T>(url: string, config?: CustomAxiosRequestConfig): Promise<T | undefined> => {
    return request({...config, method: 'GET', url});
};
const post = async <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T | undefined> => {
    return request({...config, method: 'POST', url, data});
};

const put = async <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T | undefined> => {
    return request({...config, method: 'PUT', url, data});
};

const patch = async <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T | undefined> => {
    return request({...config, method: 'PATCH', url, data});
};
const del = async <T>(url: string, config?: CustomAxiosRequestConfig): Promise<T | undefined> => {
    return request({...config, method: 'DELETE', url});
};

export default {
    instance,
    initInterceptors,
    get,
    post,
    put,
    patch,
    delete: del
};
