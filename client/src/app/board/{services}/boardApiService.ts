import {queryOptions} from "@tanstack/react-query";
import apiCall from "@/app/{commons}/func/api";
import {boardTemplateList, CommentI} from "@/app/board/{services}/types";
import {Common} from "@/app/{commons}/types/commons";
import {RateInfoI} from "@/app/board/[id]/page";

const getTemplates = () => {
    return queryOptions({
        queryKey: ['templates'],
        queryFn: async () => {
            return await apiCall<boardTemplateList[]>({
                path: '/api/board-template',
                method: 'GET',
                isReturnData: true,
            })
        },
        initialData: [],
        initialDataUpdatedAt: 1,
    })
}

const getComments = ({
    isEdit,
    boardPk,
    searchParams,
}: {
    isEdit: boolean;
    boardPk: number;
    searchParams: URLSearchParams;
}) => {
    const params = {
        boardPk,
        page: searchParams.get('page') || 1,
        size: searchParams.get('size') || 10,
    }

    return queryOptions({
        queryKey: ['getComments', params],
        queryFn: async () => {
            return isEdit
            ? {} as Common.PageResponse<CommentI>
            : await apiCall<Common.PageResponse<CommentI>>({
                path: '/api/board/comment',
                method: 'GET',
                params,
                isReturnData: true,
            })
        },
        staleTime : 5 * 60 * 1000,
        gcTime    : 5 * 60 * 1000,
    })
}

const deleteFile = async (fileUri: string) => {
    return await apiCall({
        path: '/api/file/delete/filename',
        method: 'PUT',
        body: {fileUri},
        contentType: 'application/json',
    });
}

 const getRateInfo = async (boardId: string) => {
     return await apiCall<RateInfoI>({
         path: '/api/board/rate/' + boardId,
         method: 'GET',
         call: 'Proxy'
     })
 }

const boardApiService = {
    getTemplates,
    getComments,
    deleteFile,
    getRateInfo,
}

export default boardApiService;