import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";

export async function GET(){
    const result = await apiCall<string>({
        path: '/api/user/info',
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

export async function PUT(req: NextRequest) {
    const body = await req.json() as User.AuthProps;

    const result = await apiCall<string>({
        path: '/api/user/s-auth',
        method: 'PUT',
        call: 'Server',
        body,
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