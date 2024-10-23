import {queryOptions} from "@tanstack/react-query";
import apiCall from "@/app/{commons}/func/api";
import {SystemPoint} from "@/app/system/point/{services}/types";
import {Common} from "@/app/{commons}/types/commons";
import StatusResponse = Common.StatusResponse;

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

const updatePoints = async ({body}: {body: SystemPoint.Point[]}): Promise<StatusResponse> => {
    return await apiCall<StatusResponse, SystemPoint.Point[]>({
        path: '/api/config/point',
        method: 'PUT',
        body: {list: body},
        isReturnData: true,
    });
}

const resetPoints = async ({body}: {body: SystemPoint.RequestReset}): Promise<StatusResponse> => {
    return await apiCall<StatusResponse>({
        path : '/api/config/point/reset',
        method : 'PUT',
        body,
        isReturnData : true,
    });
}

const pointApiService = {
    getPoints,
    updatePoints,
    resetPoints,
}

export default pointApiService;