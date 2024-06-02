import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {cookies} from "next/headers";
import apiCall from "@/app/{commons}/func/api";

export async function GET(
    req: NextRequest,
    {params}: {params: {id: string}},
){
    const result = await apiCall<any>({
        path: `/api/user-config-smtp/disabled/${params.id}`,
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });

}