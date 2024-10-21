import apiCall from "@/app/{commons}/func/api";
import {AttendInfoI, BoardSummaryI, PointSummaryI} from "@/app/user/{services}/userProvider";
import {queryOptions} from "@tanstack/react-query";

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
    boardSummery,
    pointSummary,
    profileImg
}

export default userApiService;