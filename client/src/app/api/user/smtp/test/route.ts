import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios from "axios";
import {SmtpI} from "@/app/user/smtp/page";
import apiCall from "@/app/{commons}/func/api";

export async function POST(req: NextRequest) {
    const data = await req.json() as SmtpI;

    const result = await apiCall<SmtpI>({
        path: '/api/user-config-smtp/test',
        method: 'POST',
        call: 'Server',
        body: data,
        setAuthorization: true,
        isReturnData: true,
    })
    .catch(err => {
        return err;
    });
    return new NextResponse(result, {
        status: 200,
    });

}