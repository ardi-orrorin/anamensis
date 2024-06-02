import {NextRequest, NextResponse} from "next/server";
import {BoardI} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {StatusResponse} from "@/app/{commons}/types/commons";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const data = await apiCall<BoardI>({
        path: '/public/api/boards/' + id,
        method: 'GET',
        call: 'Server',
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(data),{
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
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

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
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

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}