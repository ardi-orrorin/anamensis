import {NextRequest} from "next/server";
import {BoardI} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {Common} from "@/app/{commons}/types/commons";


export async function PUT(req:NextRequest) {
    const data: BoardI = await req.json();

    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const result = await apiCall<Common.StatusResponse, BoardI>({
        path: '/api/boards/select-answer/' + id,
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