import {NextRequest, NextResponse} from "next/server";
import {SmtpI} from "@/app/user/smtp/page";
import {cookies} from "next/headers";
import axios from "axios";
import apiCall from "@/app/{commons}/func/api";

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

    const data = await req.json() as SmtpI;

    const result = await apiCall<SmtpI>({
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