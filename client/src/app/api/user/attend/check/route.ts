import {NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function GET() {
    const result = await apiCall<string>({
        path: '/api/attendance/check',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })
    .catch(err => {
        return err.response.data.message;
    });

    return new NextResponse(result, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}