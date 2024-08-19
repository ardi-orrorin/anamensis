import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {Common} from "@/app/{commons}/types/commons";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {Root} from "@/app/{services}/types";

export async function GET(req: NextRequest) {

    const userId = req.nextUrl.pathname.substring(req.nextUrl.pathname.lastIndexOf('/') + 1);

    const result = await apiCall<Common.PageResponse<Root.BoardListI>>({
        path: '/public/api/boards/summary/' + userId,
        method: 'GET',
        call: 'Server',
        isReturnData: true,
    })

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
    })
}