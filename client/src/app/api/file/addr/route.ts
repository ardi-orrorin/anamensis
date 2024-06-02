import {NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function GET() {
    const result = await apiCall<string>({
        path: '/api/files/addr',
        method: 'GET',
        call: 'Server',
        contentType: 'multipart/form-data',
        setAuthorization: true,
        isReturnData: true
    });

    return new NextResponse(result, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
