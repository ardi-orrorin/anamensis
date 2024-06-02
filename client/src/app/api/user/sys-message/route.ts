import {NextRequest, NextResponse} from "next/server";
import {SysMessageI} from "@/app/user/system/{components}/message";
import apiCall from "@/app/{commons}/func/api";

export async function GET(req: NextRequest) {
    const searchParams = new URLSearchParams(req.nextUrl.search);
    const params = {id : searchParams.get('id')!}

    const res = await apiCall<SysMessageI>({
        path: `/admin/api/sys-message`,
        method: 'GET',
        call: 'Server',
        params,
        setAuthorization: true,
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(res),{
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json() as SysMessageI;

    const res = await apiCall<SysMessageI>({
        path: '/admin/api/sys-message',
        method: 'POST',
        call: 'Server',
        body,
        setAuthorization: true,
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(res),{
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function PUT(req: NextRequest) {
    const body = await req.json() as SysMessageI;

    await apiCall<SysMessageI>({
        path: '/admin/api/sys-message',
        method: 'PUT',
        call: 'Server',
        body,
        setAuthorization: true,
        isReturnData: true,
    });

    return new NextResponse(null,{
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function DELETE(req: NextRequest) {
    const searchParams = new URLSearchParams(req.nextUrl.search);

    const params = {id : searchParams.get('id')!}

    const res = await apiCall<SysMessageI>({
        path: '/admin/api/sys-message',
        method: 'DELETE',
        call: 'Server',
        params,
        setAuthorization: true,
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(res),{
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}