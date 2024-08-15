import apiCall from "@/app/{commons}/func/api";
import {keepPreviousData, queryOptions} from "@tanstack/react-query";
import {Common} from "@/app/{commons}/types/commons";
import {BoardBlocking} from "@/app/user/board-block/{services}/types";

const boardBlock = (searchParams: URLSearchParams) => {
    const params = {
        size: searchParams.get('size') || '20',
        page: searchParams.get('page') || '1',
        keyword: searchParams.get('keyword') || '',
        search: searchParams.get('search') || '',
        filterType: searchParams.get('filterType') || '',
        filterKeyword: searchParams.get('filterKeyword') || '',
    }

    return queryOptions({
        queryKey: ['boardBlock', params],
        queryFn: async () => {
            return await apiCall<Common.PageResponse<BoardBlocking.BoardBlockHistories>, any>({
                path: '/api/user/board-block-history',
                method: 'GET',
                params,
                isReturnData: true,
            })
        },
        placeholderData: keepPreviousData,
        maxPages: 10,
    })
}

const boardDetail = (id: number) => {
    return queryOptions({
        queryKey: ['boardDetail', id],
        queryFn: async () => {
            return await apiCall<BoardBlocking.BoardBlock>({
                path: '/api/user/board-block-history/' + id,
                method: 'GET',
                isReturnData: true,
            })
        },
        placeholderData: keepPreviousData,
        maxPages: 10,
    })
}

const boardBlockApiService = {
    boardBlock,
    boardDetail,
}

export default boardBlockApiService;