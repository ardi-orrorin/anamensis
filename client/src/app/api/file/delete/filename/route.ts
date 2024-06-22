import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

type BodyI = {
    fileUri: string;
}

export async function PUT(req: NextRequest) {
    const body = await req.json() as BodyI;

    const result = await apiCall({
        path: '/api/files/delete/filename',
        method: 'PUT',
        body,
        call: 'Server',
        setAuthorization: true,
        isReturnData: true
    })

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });

}