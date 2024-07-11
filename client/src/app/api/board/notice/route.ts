import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {PageResponse} from "@/app/{commons}/types/commons";
import {BoardListI} from "@/app/{components}/boardComponent";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";

export async function GET(req: NextRequest) {
    const result = await apiCall<PageResponse<BoardListI>, URLSearchParams>({
        path: '/public/api/boards/notice',
        method: 'GET',
        call: 'Server',
        isReturnData: true,
    })

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
    })
}