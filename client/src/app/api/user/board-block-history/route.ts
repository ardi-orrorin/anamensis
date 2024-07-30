import {NextRequest} from "next/server";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import {AxiosError} from "axios";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {BoardBlock, BoardBlockHistoriesI} from "@/app/user/board-block/{services}/boardBlockProvider";

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

export async function POST(req: NextRequest) {
    const body = await req.json() as BoardBlock;

    console.log(body)

    try {
        const res = await apiCall<any, BoardBlock>({
            path: '/admin/api/board-block-history',
            method: 'POST',
            body,
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
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

export async function PUT(req: NextRequest) {
    const body = await req.json() as BoardBlock;

    try {
        const res = await apiCall<any, BoardBlock>({
            path: '/api/board-block-history',
            method: 'PUT',
            body,
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
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