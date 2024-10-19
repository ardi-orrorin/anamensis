// todo: 시스템 세팅 값 호출 api 추가 reactQuery 사용 예정

import {queryOptions} from "@tanstack/react-query";
import apiCall from "@/app/{commons}/func/api";
import {System} from "@/app/system/{services}/types";


const getSystemConfig = () => {
    return queryOptions({
        queryKey: ['getSystemConfig'],
        queryFn: async () => {
            return await apiCall<System.Response>({
                path: "/api/config/system",
                method: "GET",
                isReturnData: true,
            })
        },
        initialData: {} as System.Response,
        initialDataUpdatedAt: 1,
    })
}

const initSystemConfig = async ({key}: {key: System.Key}): Promise<boolean> => {
    return await apiCall<boolean, System.Key>({
        path: '/api/config/system/init',
        method: 'GET',
        call: 'Proxy',
        params: {key: key},
        isReturnData: true,
    });
}


const systemApiServices = {
    getSystemConfig,
    initSystemConfig,
}

export default systemApiServices;