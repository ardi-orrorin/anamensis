import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export async function GET() {
    try{
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
    } catch (e) {
        return ExNextResponse({
            body: JSON.stringify([]),
            status: 200,
        })
    }
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