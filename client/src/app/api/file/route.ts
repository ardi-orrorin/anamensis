import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {UserInfoI} from "@/app/user/email/{services}/userInfoProvider";

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