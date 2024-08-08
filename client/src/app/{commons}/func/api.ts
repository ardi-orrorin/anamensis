import axios, {AxiosHeaders, AxiosRequestConfig, AxiosResponse} from "axios";

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Call = 'Proxy' | 'Server';
export type ContentType = 'application/json' | 'multipart/form-data' | '' | string;

export type ApiCallProps = {
    path              : string;
    method            : Method;
    body?             : any;
    params?           : any;
    call?             : Call;
    setAuthorization? : boolean;
    contentType?      : ContentType;
    cookie?           : string;
    isReturnData?     : boolean;
    timeout?          : number;
}

async function apiCall<R = any, I = any>(props: ApiCallProps & { isReturnData: true }): Promise<R>;
async function apiCall<R = any, I = any>(props: ApiCallProps & { isReturnData: false}): Promise<AxiosResponse<R>>;
async function apiCall<R = any, I = any>(props: ApiCallProps): Promise<AxiosResponse<R>>;

async function apiCall <R = any, I = any>(props: ApiCallProps): Promise<R | AxiosResponse<R>> {
    const {path, method
        , body, params, call
        , setAuthorization, contentType, cookie
        , isReturnData, timeout
    } = props;

    if(!path) Error('path is required');
    if(!method) Error('method is required');

    const url = ((call && call === 'Server') ? process.env.NEXT_PUBLIC_SERVER : '')  + path;

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

    if(method === 'POST' || method === 'PUT' || method === 'PATCH') {
        if(!body) Error('path body is required');
        config.data = body;
    } if(method === 'GET' || method === 'DELETE') {
        config.params = params;
    }

    if(timeout) {
        config.timeout = timeout;
    }


    const res = await Axios.request<I, AxiosResponse<R>, I>(config);
    if (isReturnData) return res.data;
    return res;
}

export default apiCall;
