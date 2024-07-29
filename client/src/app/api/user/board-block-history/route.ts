import {NextRequest} from "next/server";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import {AxiosError} from "axios";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {BoardBlockHistoriesI} from "@/app/user/board-block/{services}/boardBlockProvider";

export async function GET(req: NextRequest){
    const params = req.nextUrl.searchParams;

    try {
        const res = await apiCall<PageResponse<BoardBlockHistoriesI>, any>({
            path: '/api/board-block-history',
            method: 'GET',
            params,
            call: 'Server',
            isReturnData: true,
            setAuthorization: true,
        });

        return ExNextResponse({
            body: JSON.stringify(res),
            status: 200,
        })


    } catch(e) {
        const err = e as AxiosError;
        return ExNextResponse({
            body: JSON.stringify(err.response?.data),
            status: err.response?.status || 500,
        })
    }
}