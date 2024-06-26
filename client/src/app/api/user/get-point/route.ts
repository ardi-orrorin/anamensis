import {UserInfoI} from "@/app/user/email/page";
import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export async function GET() {
    const result = await apiCall<UserInfoI>({
        path: '/api/user/get-point',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
    })
}
