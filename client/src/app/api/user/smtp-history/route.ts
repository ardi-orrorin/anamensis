import {NextRequest, NextResponse} from "next/server";
import {PageResponse} from "@/app/{commons}/types/commons";
import {SmtpHistoryI} from "@/app/user/smtp-history/page";
import apiCall from "@/app/{commons}/func/api";

export async function GET(req: NextRequest): Promise<NextResponse<PageResponse<SmtpHistoryI>>> {
    const search = new URLSearchParams(req.nextUrl.search);

    const params = {
            page: search.get('page') || 1,
            size: search.get('size') || 10,
    };

    const result = await apiCall<PageResponse<SmtpHistoryI>>({
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