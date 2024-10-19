import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {Common} from "@/app/{commons}/types/commons";
import {SystemSMTP} from "@/app/system/smtp/{services}/types";

export async function GET(req: NextRequest): Promise<NextResponse<Common.PageResponse<SystemSMTP.History>>> {
    const search = new URLSearchParams(req.nextUrl.search);

    const params = {
            page: search.get('page') || 1,
            size: search.get('size') || 10,
    };

    const result = await apiCall<Common.PageResponse<SystemSMTP.History>>({
        path: '/api/user-config-smtp',
        method: 'GET',
        call: 'Server',
        params,
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