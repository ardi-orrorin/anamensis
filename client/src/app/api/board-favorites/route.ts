import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {PageResponse} from "@/app/{commons}/types/commons";
import {BoardListI} from "@/app/{components}/boardComponent";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";

export async function GET() {
    const result = await apiCall<number[]>({
        path: '/api/board-favorites',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
    })
}


export async function POST(req: NextRequest) {
    const body = await req.json();
    const result = await apiCall<any, boolean>({
        path: '/api/board-favorites',
        method: 'POST',
        body,
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
    })
}