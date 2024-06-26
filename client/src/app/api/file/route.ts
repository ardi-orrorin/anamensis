import {NextRequest, NextResponse} from "next/server";
import {UserInfoI} from "@/app/user/email/page";
import apiCall from "@/app/{commons}/func/api";

export async function PATCH(req: NextRequest) {
    const body = await req.json();

    const result = await apiCall<UserInfoI>({
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