import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {SMTP} from "@/app/user/smtp/{services}/types";

export async function POST(req: NextRequest) {
    const data = await req.json() as SMTP.FullProps;

    const result = await apiCall<SMTP.FullProps>({
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