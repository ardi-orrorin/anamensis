import axios from "axios";
import {cookies} from "next/headers";
import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function GET() {
    const res = await apiCall<any>({
        path: '/api/otp',
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

export async function POST(req: NextRequest) {
    const {code} = await req.json();

    const res = await apiCall<any>({
        path: '/api/otp/verify',
        method: 'POST',
        call: 'Server',
        body: code,
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



export async function DELETE(req: NextRequest) {
    const res = await apiCall<any>({
        path: '/api/otp/disable',
        method: 'DELETE',
        call: 'Server',
        setAuthorization: true,
    });

    return new Response(JSON.stringify(res.data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });


}