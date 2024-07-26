import {NextRequest, NextResponse} from "next/server";
import {BoardI, BoardTemplate} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {StatusResponse} from "@/app/{commons}/types/commons";
import {cookies} from "next/headers";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export async function GET(req: NextRequest) {

    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    try{
       const data = await apiCall<BoardI>({
            path: '/api/board-template/' + id,
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify(data),
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

export async function DELETE(req: NextRequest) {

    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    try{
        const data = await apiCall<BoardI>({
            path: '/api/board-template/disable',
            method: 'PUT',
            body: {
                ids: [id]
            },
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify(data),
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