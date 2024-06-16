import {NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function GET(){
    const result = await apiCall<string>({
        path: '/api/attendance',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })
    .catch(err => {
        return err?.response?.data?.message;
    });
    console.log(result);

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}