import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {OTP} from "@/app/user/otp/{services}/types";

export async function GET() {

    try {
        const res = await apiCall<OTP.Info>({
            path: '/api/otp',
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        const res = {
            id: 0,
            sAuth: false,
            createAt: '',
        } as OTP.Info;

        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function POST(req: NextRequest) {
    const {code} = await req.json();

    const res = await apiCall<any>({
        path: '/api/otp/verify',
        method: 'POST',
        call: 'Server',
        body: code,
        setAuthorization: true,
        isReturnData: true,
    });

    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}



export async function DELETE(req: NextRequest) {
    const res = await apiCall<any>({
        path: '/api/otp/disable',
        method: 'DELETE',
        call: 'Server',
        setAuthorization: true,
    });

    return new Response(JSON.stringify(res.data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });


}