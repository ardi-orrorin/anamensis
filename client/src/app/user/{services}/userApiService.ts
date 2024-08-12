import apiCall from "@/app/{commons}/func/api";
import {AttendInfoI, BoardSummaryI, PointSummaryI} from "@/app/user/{services}/userProvider";
import {queryOptions} from "@tanstack/react-query";

const attend = () => {
    return queryOptions({
        queryKey: ['attend'],
        queryFn: async () => {
            return await apiCall<AttendInfoI>({
                path: "/api/user/attend",
                method: "GET",
                isReturnData: true,
            })
        },
        initialData: {} as AttendInfoI,
        initialDataUpdatedAt: 1,
    })
}

const attendCheck = async () => {
    return await apiCall<string>({
        path: "/api/user/attend/check",
        method: "GET",
    })
}

const boardSummery = () => {
    return queryOptions({
        queryKey: ['boardSummery'],
        queryFn: async () => {
            return await apiCall<BoardSummaryI[]>({
                path: "/api/board/summary",
                params: {page:1, size: 8},
                method: "GET",
                isReturnData: true
            })
        },
        initialData: [],
        initialDataUpdatedAt: 1,
    })
}

const pointSummary = () => {
    return queryOptions({
        queryKey: ['pointSummary'],
        queryFn: async () => {
            return await apiCall<PointSummaryI[]>({
                path: "/api/user/point-history/summary",
                params: {page:1, size: 8},
                method: "GET",
                isReturnData: true,
            })
        },
        initialData: [],
        initialDataUpdatedAt: 1,
    })
}

const profileImg = () => {
    return queryOptions({
        queryKey: ['profileImg'],
        queryFn: async () => {
            return await apiCall<string>({
                path: '/api/user/info/profile-img',
                method: 'GET',
                isReturnData: true,
            })
        },
        initialData: '',
        initialDataUpdatedAt: 1,
    })
}


const userApiService = {
    attend,
    boardSummery,
    pointSummary,
    attendCheck,
    profileImg
}

export default userApiService;