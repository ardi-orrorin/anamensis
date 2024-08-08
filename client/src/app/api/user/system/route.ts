import {NextRequest, NextResponse} from "next/server";
import {WebSysI} from "@/app/user/system/page";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {AxiosError} from "axios";

export async function GET() {
    try {
        const res = await apiCall<WebSysI[]>({
            path: `/admin/api/web-sys`,
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify(res),
            status: 200,
        });

    } catch (e) {
        const err = e as AxiosError;
        const message = err.status == 403 ? '권한이 없습니다.' : '서버 오류입니다.';
        return ExNextResponse({
            body: JSON.stringify({message}),
            status: err.status || 500,
        })
    }

}

export async function POST(req: NextRequest) {
    const body = await req.json() as WebSysI;

    await apiCall<any>({
        path: '/admin/api/web-sys',
        method: 'POST',
        call: 'Server',
        body,
        setAuthorization: true,
    });

    return new NextResponse(null, {
        status: 200,
    });
}

export async function PUT(req: NextRequest) {
    const body = await req.json() as WebSysI;

    await apiCall<any>({
        path: '/admin/api/web-sys',
        method: 'PUT',
        call: 'Server',
        body,
        setAuthorization: true,
    });

    return new NextResponse(null, {
        status: 200,
    });
}

