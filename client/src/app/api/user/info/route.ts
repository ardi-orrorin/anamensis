import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";

export async function GET() {
    const result = await apiCall<User.UserInfo>({
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

    const data = await req.json();

    const result = await apiCall<User.UserInfo>({
        path: '/api/user/info',
        method: 'PUT',
        call: 'Server',
        body: data,
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

