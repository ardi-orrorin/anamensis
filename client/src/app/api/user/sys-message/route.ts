import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {System} from "@/app/user/system/{services}/types";
import {AxiosError} from "axios";

export async function GET(req: NextRequest) {
    const searchParams = new URLSearchParams(req.nextUrl.search);
    const params = {id : searchParams.get('id')!}

    try {
        const res = await apiCall<System.SysMessage>({
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


    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(null,{
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json() as System.SysMessage;

    const res = await apiCall<System.SysMessage>({
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
    const body = await req.json() as System.SysMessage;

    await apiCall<System.SysMessage>({
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

    const res = await apiCall<System.SysMessage>({
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