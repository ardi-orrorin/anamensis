import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {UserInfoI} from "@/app/user/email/page";
import {PageResponse} from "@/app/{commons}/types/commons";
import {SmtpHistoryI} from "@/app/user/smtp-history/page";

export async function GET(req: NextRequest): Promise<NextResponse<PageResponse<SmtpHistoryI>>> {
    const search = new URLSearchParams(req.nextUrl.search);

    const url = process.env.NEXT_PUBLIC_SERVER + '/api/smtp-push-history';
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const result = await axios.get(url, {
        params: {
            page : search.get('page') || 1,
            size : search.get('size') || 10,
        },
        headers: {
            'Authorization': 'Bearer ' + token?.value,
        }
    }).then((res: AxiosResponse<UserInfoI>) => {
        return res.data;
    });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}