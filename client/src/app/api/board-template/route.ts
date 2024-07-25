import {NextRequest, NextResponse} from "next/server";
import {BoardI, BoardTemplate} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {StatusResponse} from "@/app/{commons}/types/commons";
import {cookies} from "next/headers";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {TemplateList} from "@/app/board/[id]/{components}/templateMenu";

export async function GET() {
    try{
       const data = await apiCall<TemplateList>({
            path: '/api/board-template',
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
export async function POST(req: NextRequest) {
    const body = await req.json() as BoardTemplate;

    const result = await apiCall<StatusResponse, BoardTemplate>({
        path: '/api/board-template',
        method: 'POST',
        call: 'Server',
        body,
        setAuthorization: true,
        isReturnData: true,
    });

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
        isRoles: false,
    });
}

export async function PUT(req:NextRequest) {
    const body = await req.json() as BoardTemplate;

    const result = await apiCall<StatusResponse, BoardTemplate>({
        path: '/api/board-template/',
        method: 'PUT',
        call: 'Server',
        body,
        setAuthorization: true,
        isReturnData: true,
    });

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
        isRoles: false,
    });
}
