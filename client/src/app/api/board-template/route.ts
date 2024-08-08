import {NextRequest} from "next/server";
import {BoardTemplate, boardTemplateList} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {Common} from "@/app/{commons}/types/commons";

export async function GET() {
    try{
       const data = await apiCall<boardTemplateList[]>({
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

    const result = await apiCall<Common.StatusResponse, BoardTemplate>({
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

    const result = await apiCall<Common.StatusResponse, BoardTemplate>({
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
