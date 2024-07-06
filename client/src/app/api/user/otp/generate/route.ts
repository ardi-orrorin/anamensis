import axios from "axios";
import {cookies} from "next/headers";
import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function GET() {
    const res = await apiCall<any>({
        path: '/api/otp/generate',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
