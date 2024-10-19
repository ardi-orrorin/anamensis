import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {SystemSMTP} from "@/app/system/smtp/{services}/types";

export async function GET(req: NextRequest) {

    const id = req.nextUrl.searchParams.get('id');

    const result = await apiCall<any>({
        path: `/api/user-config-smtp${id ? `/${id}` : ''}`,
        method: 'GET',
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

export async function POST(req: NextRequest) {

    const data = await req.json() as SystemSMTP.FullProps;

    const result = await apiCall<SystemSMTP.FullProps>({
        path: '/api/user-config-smtp',
        method: 'POST',
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