import apiCall from "@/app/{commons}/func/api";
import {queryOptions} from "@tanstack/react-query";
import {System} from "@/app/system/message/{services}/types";
import {Root} from "@/app/{services}/types";

const userRole = () => {
    return queryOptions({
        queryKey: ['userRole'],
        queryFn: async () => {
            return await apiCall<System.Role[]>({
                path: '/api/user/roles',
                method: 'GET',
                isReturnData: true,
            });
        },
        initialData: [],
        initialDataUpdatedAt: 1,
    })
}

const getNotices = () => {
    return queryOptions({
        queryKey: ['notieces'],
        queryFn: async () => {
            return await apiCall<Root.NoticeType[]>({
                path: '/api/board/notice',
                method: 'GET',
                isReturnData: true
            });
        },
        initialData: [],
        initialDataUpdatedAt: 1,
        staleTime: 5 * 60 * 1000,
    })
}


const scheduleAlert = () => {
    return queryOptions({
        queryKey: ['scheduleAlert'],
        queryFn: async () => {
            return await apiCall<Root.ScheduleAlert[]>({
                method: 'GET',
                path: '/api/schedule/alert',
                isReturnData: true
            });
        },
        initialData: [],
        initialDataUpdatedAt: 1,
        refetchIntervalInBackground: true,
        refetchInterval: 60 * 1000,
        staleTime: 60 * 1000,
    })
}

const scheduleAlertToday = () => {
    return queryOptions({
        queryKey: ['scheduleAlertToday'],
        queryFn: async () => {
            return await apiCall<Root.ScheduleAlert[]>({
                method: 'GET',
                path: '/api/schedule/alert/today',
                isReturnData: true
            });
        },
        initialData: [],
        initialDataUpdatedAt: 1,
        refetchOnMount: 'always',
    })
}


const favorites = () => {
    return queryOptions({
        queryKey: ['favorites'],
        queryFn: async () => {
            return await apiCall<string[]>({
                path: '/api/board-favorites',
                method: 'GET',
                isReturnData: true
            })
        },
        initialData: [],
        initialDataUpdatedAt: 1,
    })
}


const rootApiService = {
    userRole,
    scheduleAlert,
    getNotices,
    scheduleAlertToday,
    favorites
}

export default rootApiService;