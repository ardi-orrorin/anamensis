import {AuthPropsI} from "@/app/user/email/page";
import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function GET(){
    const result = await apiCall<string>({
        path: '/api/user/info',
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

export async function PUT(req: NextRequest) {
    const {sauth, sauthType} = await req.json() as AuthPropsI;

    const result = await apiCall<string>({
        path: '/api/user/s-auth',
        method: 'PUT',
        call: 'Server',
        body: {sauth, sauthType},
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