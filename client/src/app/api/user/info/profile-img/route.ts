import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";

export async function POST(req: NextRequest) {
    const data = await req.formData();

    const result = await apiCall<User.UserInfo>({
        path: '/api/files/profile',
        method: 'POST',
        call: 'Server',
        body: data,
        contentType: 'multipart/form-data',
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

export async function GET() {
    const result = await apiCall<string>({
        path: '/api/user/profile-img',
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

export async function DELETE() {
    const result = await apiCall<User.UserInfo>({
        path: '/api/files/profile',
        method: 'DELETE',
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

