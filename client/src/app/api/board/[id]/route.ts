import {NextRequest, NextResponse} from "next/server";
import {BoardI} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {StatusResponse} from "@/app/{commons}/types/commons";
import {cookies} from "next/headers";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const getCookies = (cookies().get('next.access.token') || cookies().get('next.refresh.token'))?.value !== undefined;

    try{
       const data = await apiCall<BoardI>({
            path: '/public/api/boards/' + id,
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify({...data, isLogin: getCookies}),
            status: 200,
            isRoles: false,
        })

    } catch (e: any) {
        return ExNextResponse({
            body: JSON.stringify(e.response.data),
            status: e.response.status,
            isRoles: false,
        })
    }

}

export async function PUT(req:NextRequest) {
    const data: BoardI = await req.json();

    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const result = await apiCall<StatusResponse, BoardI>({
        path: '/api/boards/' + id,
        method: 'PUT',
        call: 'Server',
        body: data,
        setAuthorization: true,
        isReturnData: true,
    });

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
        isRoles: false,
    });
}

export async function DELETE(req:NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const result = await apiCall<any>({
        path: '/api/boards/' + id,
        method: 'DELETE',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
        isRoles: false,
    });
}