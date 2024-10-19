// todo: 시스템 세팅 값 호출 api 추가 reactQuery 사용 예정

import {queryOptions} from "@tanstack/react-query";
import apiCall from "@/app/{commons}/func/api";
import {System} from "@/app/system/{services}/types";


const getPrivateSystemConfig = () => {
    return queryOptions({
        queryKey: ['getSystemConfig'],
        queryFn: async () => {
            return await apiCall<System.PrivateResponse>({
                path: "/api/config/private/system",
                method: "GET",
                isReturnData: true,
            })
        },
        initialData: {} as System.PrivateResponse,
        initialDataUpdatedAt: 1,
    })
}

const getPublicSystemConfig = () => {
    return queryOptions({
        queryKey: ['getSystemConfig'],
        queryFn: async () => {
            return await apiCall<System.PublicResponse>({
                path: "/api/config/public/system",
                method: "GET",
                isReturnData: true,
            })
        },
        initialData: {} as System.PublicResponse,
        initialDataUpdatedAt: 1,
    })
}

const initSystemConfig = async ({key}: {key: System.Key}): Promise<boolean> => {
    return await apiCall<boolean, System.Key>({
        path: '/api/config/system/private/init',
        method: 'GET',
        call: 'Proxy',
        params: {key: key},
        isReturnData: true,
    });
}


const systemApiServices = {
    getPrivateSystemConfig,
    getPublicSystemConfig,
    initSystemConfig,
}

export default systemApiServices;