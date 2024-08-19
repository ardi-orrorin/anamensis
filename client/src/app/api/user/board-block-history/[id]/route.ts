import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {AxiosError} from "axios";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {Common} from "@/app/{commons}/types/commons";
import {BoardBlocking} from "@/app/user/board-block/{services}/types";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    try {
        const res = await apiCall<Common.PageResponse<BoardBlocking.BoardBlock>, any>({
            path: '/api/board-block-history/' + id,
            method: 'GET',
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

