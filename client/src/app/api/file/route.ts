import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";

export async function PATCH(req: NextRequest) {
    const body = await req.json();

    const result = await apiCall<User.UserInfo>({
        path: '/api/files/content',
        method: 'PATCH',
        call: 'Server',
        setAuthorization: true,
        body
    });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}