import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {NextRequest} from "next/server";
import {Root} from "@/app/{services}/types";

export async function GET(req: NextRequest) {
    const searchParams = new URLSearchParams(req.nextUrl.searchParams);
    const result = await apiCall<Root.NoticeType[]>({
        path: '/public/api/boards/notice',
        method: 'GET',
        call: 'Server',
        isReturnData: true,
    })

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
        isRoles: false,
    })
}