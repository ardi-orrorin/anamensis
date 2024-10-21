import {queryOptions} from "@tanstack/react-query";
import apiCall from "@/app/{commons}/func/api";
import {SystemPoint} from "@/app/system/point/{services}/types";

const getPoints = () => {
    return queryOptions({
        queryKey: ['getPoints'],
        queryFn: async () => {
            return await apiCall<SystemPoint.Point[]>({
                path: "/api/config/point",
                method: "GET",
                isReturnData: true,
            })
        },
        initialData: [],
        initialDataUpdatedAt: 1,
    })
}

const updatePoints = async ({body}: {body: SystemPoint.Point[]}): Promise<{ result: boolean }> => {
    return await apiCall<{ result: boolean }, SystemPoint.Point[]>({
        path: '/api/config/point',
        method: 'PUT',
        body: {list: body},
        isReturnData: true,
    });
}

const pointApiService = {
    getPoints,
    updatePoints,
}

export default pointApiService;