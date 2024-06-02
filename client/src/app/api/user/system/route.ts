import {NextRequest, NextResponse} from "next/server";
import {WebSysI} from "@/app/user/system/page";
import apiCall from "@/app/{commons}/func/api";

export async function GET() {
    const res = await apiCall<WebSysI[]>({
        path: `/admin/api/web-sys`,
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(res), {
        status: 200,
    });
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

