import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {NoticeType} from "@/app/{components}/boards/notices";

export async function GET() {
    const result = await apiCall<NoticeType[]>({
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