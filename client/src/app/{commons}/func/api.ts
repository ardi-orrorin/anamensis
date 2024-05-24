import axios, {AxiosHeaders, AxiosRequestConfig, AxiosResponse} from "axios";

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type Call = 'Proxy' | 'Server';
export type ContentType = 'application/json' | 'multipart/form-data' | string;

const apiCall = async <R = any, I = any>({
    path, method,
    body, params, call,
    setAuthorization, contentType, cookie,
}: {
    path              : string;
    method            : Method;
    body?             : I;
    params?           : I;
    call?             : Call;
    setAuthorization? : boolean;
    contentType?      : ContentType;
    cookie?           : string;

}) => {
    if(!call) Error('call is required');
    if(!path) Error('path is required');
    if(!method) Error('method is required');


    const url = (call && call === 'Server' ? process.env.NEXT_PUBLIC_SERVER : '')  + path;

    const headers = new AxiosHeaders();
    if(contentType) {
        headers.setContentType(contentType);
    } else if(method !== 'DELETE') {
        headers.setContentType('application/json');
    }

    if(setAuthorization) {
        let token = cookie;
        if(typeof window === 'undefined') {
            const {cookies} = require('next/headers');
            token = (cookies().get('next.access.token') || cookies().get('next.refresh.token'))?.value;
        }

        if(token) {
            headers.setAuthorization( 'Bearer ' + token);
        } else {
            Error('token is required');
        }
    }

    const Axios = axios.create();
    const config: AxiosRequestConfig<I> = {
        headers,
        method,
        url,
    }

    if(method === 'POST' || method === 'PUT') {
        if(!body) Error('path body is required');
        config.data = body;
    } if(method === 'GET') {
        config.params = params;
    }

    return await Axios.request<I, AxiosResponse<R>, I>(config);
}

export default apiCall;