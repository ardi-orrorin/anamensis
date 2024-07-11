import apiCall from "@/app/{commons}/func/api";
import {NoticeType} from "@/app/{components}/boards/notices";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = new URLSearchParams(req.nextUrl.searchParams);
    const result = await apiCall<NoticeType[]>({
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