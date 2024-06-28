import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {PageResponse} from "@/app/{commons}/types/commons";
import {BoardListI} from "@/app/{components}/boardComponent";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";

export async function GET(req: NextRequest) {

    const userId = req.nextUrl.pathname.substring(req.nextUrl.pathname.lastIndexOf('/') + 1);

    const result = await apiCall<PageResponse<BoardListI>>({
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